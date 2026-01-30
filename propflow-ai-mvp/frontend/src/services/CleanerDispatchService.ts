/**
 * Automated Cleaner Dispatch System
 * Solves Pain Point #2: Cleaning Coordination
 * 
 * Key Features:
 * - Automatic cleaner assignment with backup system
 * - Quality scoring and intelligent matching
 * - Emergency replacement handling
 * - Photo verification workflow
 */

import { EventBus, EventType, Event } from '../core/events/EventBus';
import { Property, Cleaner, CleaningJob, CleanerAvailability, Booking } from '../models';

interface CleanerMatch {
  cleaner: Cleaner;
  score: number;
  availability: boolean;
  distance: number;
  estimatedCost: number;
  reasons: string[];
}

export class CleanerDispatchService {
  constructor(
    private eventBus: EventBus,
    private cleanerRepository: CleanerRepository,
    private propertyRepository: PropertyRepository,
    private jobRepository: CleaningJobRepository,
    private availabilityRepository: AvailabilityRepository,
    private notificationService: NotificationService
  ) {
    this.registerEventHandlers();
  }

  private registerEventHandlers(): void {
    this.eventBus.register({
      eventTypes: [
        EventType.GUEST_CHECKOUT,
        EventType.BOOKING_CONFIRMED,
        EventType.CLEANER_UNAVAILABLE
      ],
      handle: this.handleEvent.bind(this)
    });
  }

  private async handleEvent(event: Event): Promise<void> {
    switch (event.type) {
      case EventType.GUEST_CHECKOUT:
        await this.scheduleCleaningAfterCheckout(event);
        break;
      
      case EventType.BOOKING_CONFIRMED:
        await this.schedulePreArrivalCleaning(event);
        break;
      
      case EventType.CLEANER_UNAVAILABLE:
        await this.handleCleanerCancellation(event);
        break;
    }
  }

  /**
   * Core Algorithm: Find and assign the best cleaner for a job
   */
  async assignCleaner(jobId: string): Promise<{
    primary: Cleaner;
    backups: Cleaner[];
    estimatedCost: number;
  }> {
    const job = await this.jobRepository.findById(jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);

    const property = await this.propertyRepository.findById(job.propertyId);
    if (!property) throw new Error(`Property ${job.propertyId} not found`);

    // Find all potential cleaners
    const matches = await this.findCleanerMatches(property, job);
    
    if (matches.length === 0) {
      throw new Error('No available cleaners found for this job');
    }

    // Sort by composite score
    matches.sort((a, b) => b.score - a.score);

    const primaryCleaner = matches[0].cleaner;
    const backupCleaners = matches.slice(1, 4).map(m => m.cleaner); // Top 3 backups

    // Reserve the time slot
    await this.reserveCleanerSlot(primaryCleaner.id, job.scheduledStart, job.scheduledEnd);

    // Update job with assignment
    await this.jobRepository.update(jobId, {
      assignedCleaner: primaryCleaner.id,
      backupCleaners: backupCleaners.map(c => c.id),
      status: 'assigned',
      pricing: {
        ...job.pricing,
        baseRate: matches[0].estimatedCost
      }
    });

    // Notify cleaner
    await this.notificationService.notifyCleaner(primaryCleaner.id, {
      type: 'job_assigned',
      jobId,
      property: property.name,
      scheduledTime: job.scheduledStart,
      estimatedDuration: job.requirements.estimatedDuration,
      rate: matches[0].estimatedCost
    });

    // Publish event
    await this.eventBus.publish({
      id: `cleaner-assigned-${Date.now()}`,
      type: EventType.CLEANER_ASSIGNED,
      propertyId: job.propertyId,
      timestamp: new Date(),
      data: {
        jobId,
        cleanerId: primaryCleaner.id,
        backupIds: backupCleaners.map(c => c.id)
      }
    });

    return {
      primary: primaryCleaner,
      backups: backupCleaners,
      estimatedCost: matches[0].estimatedCost
    };
  }

  /**
   * Advanced cleaner matching algorithm considering:
   * - Quality score and reliability metrics
   * - Distance and travel time
   * - Availability and scheduling flexibility  
   * - Cost optimization
   * - Property-specific requirements
   */
  private async findCleanerMatches(property: Property, job: CleaningJob): Promise<CleanerMatch[]> {
    const availableCleaners = await this.cleanerRepository.findAvailable(
      job.scheduledStart,
      job.scheduledEnd,
      property.address.coordinates,
      20 // 20 mile radius
    );

    const matches: CleanerMatch[] = [];

    for (const cleaner of availableCleaners) {
      const score = await this.calculateCleanerScore(cleaner, property, job);
      const distance = this.calculateDistance(
        property.address.coordinates,
        cleaner.serviceArea.coordinates
      );
      const cost = this.calculateJobCost(cleaner, job);

      matches.push({
        cleaner,
        score,
        availability: true,
        distance,
        estimatedCost: cost,
        reasons: this.getScoreReasons(cleaner, property, job, score)
      });
    }

    return matches.filter(m => m.score > 0.5); // Minimum quality threshold
  }

  /**
   * Composite scoring algorithm (0-1 scale)
   */
  private async calculateCleanerScore(cleaner: Cleaner, property: Property, job: CleaningJob): Promise<number> {
    const qualityWeight = 0.4;
    const reliabilityWeight = 0.3;
    const proximityWeight = 0.2;
    const costWeight = 0.1;

    // Quality Score (0-1)
    const qualityScore = cleaner.qualityScore / 10;

    // Reliability Score (0-1)
    const reliabilityScore = Math.min(1, (
      (cleaner.metrics.onTimePercentage / 100) * 0.4 +
      ((100 - cleaner.metrics.cancellationRate) / 100) * 0.4 +
      (Math.min(cleaner.metrics.responseTimeMinutes, 60) / 60) * 0.2
    ));

    // Proximity Score (0-1) - closer is better
    const distance = this.calculateDistance(
      property.address.coordinates,
      cleaner.serviceArea.coordinates
    );
    const proximityScore = Math.max(0, 1 - (distance / cleaner.serviceArea.radiusMiles));

    // Cost Score (0-1) - lower cost is better, but capped to avoid race to bottom
    const jobCost = this.calculateJobCost(cleaner, job);
    const marketRate = await this.getMarketRate(property.address.city, job.type);
    const costScore = Math.max(0.5, Math.min(1, marketRate / jobCost));

    const compositeScore = (
      qualityScore * qualityWeight +
      reliabilityScore * reliabilityWeight +
      proximityScore * proximityWeight +
      costScore * costWeight
    );

    // Bonus factors
    let bonusMultiplier = 1.0;
    
    // Property familiarity bonus
    const previousJobs = await this.jobRepository.findByCleanerAndProperty(cleaner.id, property.id);
    if (previousJobs.length > 0) {
      const avgRating = previousJobs.reduce((sum, job) => sum + (job.quality.hostRating || 5), 0) / previousJobs.length;
      if (avgRating >= 4.5) bonusMultiplier += 0.1;
    }

    // Specialty match bonus
    if (job.type === 'emergency' && cleaner.rates.emergencyRate > 0) {
      bonusMultiplier += 0.15;
    }

    return Math.min(1, compositeScore * bonusMultiplier);
  }

  private getScoreReasons(cleaner: Cleaner, property: Property, job: CleaningJob, score: number): string[] {
    const reasons: string[] = [];
    
    if (cleaner.qualityScore >= 8.5) reasons.push("High quality score");
    if (cleaner.metrics.onTimePercentage >= 95) reasons.push("Excellent punctuality");
    if (cleaner.metrics.cancellationRate <= 5) reasons.push("Very reliable");
    
    const distance = this.calculateDistance(property.address.coordinates, cleaner.serviceArea.coordinates);
    if (distance <= 5) reasons.push("Very close to property");
    else if (distance <= 10) reasons.push("Close to property");
    
    if (cleaner.backgroundCheck && cleaner.insurance) reasons.push("Fully verified");
    
    return reasons;
  }

  /**
   * Emergency cleaner replacement system
   */
  async handleCleanerCancellation(event: Event): Promise<void> {
    const { cleanerId, jobId, reason, timestamp } = event.data;
    
    const job = await this.jobRepository.findById(jobId);
    if (!job || job.status !== 'assigned') return;

    // Log the cancellation
    await this.jobRepository.addTimelineEvent(jobId, {
      timestamp: new Date(timestamp),
      event: 'cleaner_cancelled',
      details: reason,
      actor: cleanerId
    });

    // Try backup cleaners in order
    for (const backupId of job.backupCleaners) {
      const isAvailable = await this.checkCleanerAvailability(
        backupId,
        job.scheduledStart,
        job.scheduledEnd
      );

      if (isAvailable) {
        const backup = await this.cleanerRepository.findById(backupId);
        if (!backup) continue;

        // Assign backup cleaner
        await this.jobRepository.update(jobId, {
          assignedCleaner: backupId,
          backupCleaners: job.backupCleaners.filter(id => id !== backupId)
        });

        // Reserve the slot
        await this.reserveCleanerSlot(backupId, job.scheduledStart, job.scheduledEnd);

        // Notify backup cleaner with urgency
        await this.notificationService.notifyCleaner(backupId, {
          type: 'emergency_assignment',
          jobId,
          originalCleanerId: cleanerId,
          scheduledTime: job.scheduledStart,
          emergencyBonus: this.calculateEmergencyBonus(job.scheduledStart)
        });

        // Notify host about the change
        await this.notificationService.notifyHost(job.propertyId, {
          type: 'cleaner_replaced',
          originalCleaner: cleanerId,
          newCleaner: backup.name,
          jobId,
          reason: 'Original cleaner unavailable'
        });

        return; // Successfully replaced
      }
    }

    // No backup available - escalate to emergency protocol
    await this.handleEmergencyCleaningNeeded(jobId);
  }

  private async handleEmergencyCleaningNeeded(jobId: string): Promise<void> {
    const job = await this.jobRepository.findById(jobId);
    if (!job) return;

    // Mark as high priority emergency
    await this.jobRepository.update(jobId, {
      priority: 'critical',
      type: 'emergency'
    });

    // Broadcast emergency request to all cleaners in area
    const emergencyMatches = await this.findEmergencyCleaners(job);
    
    if (emergencyMatches.length > 0) {
      // Offer higher rate for emergency pickup
      await this.broadcastEmergencyRequest(job, emergencyMatches);
    } else {
      // Last resort: notify host to handle manually
      await this.notificationService.escalateToHost(job.propertyId, {
        type: 'no_cleaner_available',
        jobId,
        scheduledTime: job.scheduledStart,
        suggestedActions: [
          'Clean property yourself',
          'Hire cleaner directly',
          'Reschedule guest if possible'
        ]
      });
    }
  }

  private async scheduleCleaningAfterCheckout(event: Event): Promise<void> {
    const { bookingId, checkoutTime, propertyId } = event.data;
    
    // Get next booking to determine cleaning urgency
    const nextBooking = await this.getNextBooking(propertyId, new Date(checkoutTime));
    
    const cleaningJob: Partial<CleaningJob> = {
      propertyId,
      bookingId,
      type: 'standard',
      scheduledStart: new Date(new Date(checkoutTime).getTime() + 30 * 60000), // 30 min after checkout
      priority: nextBooking ? this.calculateCleaningUrgency(checkoutTime, nextBooking.checkIn) : 'medium',
      status: 'pending'
    };

    const jobId = await this.jobRepository.create(cleaningJob);
    await this.assignCleaner(jobId);
  }

  private calculateCleaningUrgency(checkoutTime: string, nextCheckinTime: Date): 'low' | 'medium' | 'high' | 'critical' {
    const timeDiff = nextCheckinTime.getTime() - new Date(checkoutTime).getTime();
    const hoursUntilNextGuest = timeDiff / (1000 * 60 * 60);

    if (hoursUntilNextGuest < 4) return 'critical';
    if (hoursUntilNextGuest < 8) return 'high';
    if (hoursUntilNextGuest < 24) return 'medium';
    return 'low';
  }

  // Helper methods
  private calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
    // Haversine formula for distance calculation
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLng = this.toRadians(coord2.lng - coord1.lng);
    const a = Math.sin(dLat/2) ** 2 + Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) * Math.sin(dLng/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private calculateJobCost(cleaner: Cleaner, job: CleaningJob): number {
    const duration = job.requirements.estimatedDuration / 60; // convert to hours
    const baseRate = job.type === 'emergency' ? cleaner.rates.emergencyRate : cleaner.rates.standardCleaning;
    return duration * baseRate;
  }

  private async getMarketRate(city: string, jobType: string): Promise<number> {
    // This would integrate with market data service
    return 25; // $25/hour baseline
  }

  private async reserveCleanerSlot(cleanerId: string, startTime: Date, endTime: Date): Promise<void> {
    // Implementation would update availability calendar
  }

  private async checkCleanerAvailability(cleanerId: string, startTime: Date, endTime: Date): Promise<boolean> {
    // Implementation would check real availability
    return true;
  }

  private calculateEmergencyBonus(scheduledTime: Date): number {
    const hoursNotice = (scheduledTime.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursNotice < 2) return 50; // $50 bonus for <2 hours
    if (hoursNotice < 4) return 25; // $25 bonus for <4 hours
    return 0;
  }

  private async findEmergencyCleaners(job: CleaningJob): Promise<Cleaner[]> {
    // Find cleaners who accept emergency jobs
    return this.cleanerRepository.findEmergencyAvailable(job.scheduledStart);
  }

  private async broadcastEmergencyRequest(job: CleaningJob, cleaners: Cleaner[]): Promise<void> {
    // Send push notifications to multiple cleaners, first to accept gets the job
  }

  private async getNextBooking(propertyId: string, after: Date): Promise<Booking | null> {
    // Implementation would query booking system
    return null;
  }

  private async schedulePreArrivalCleaning(event: Event): Promise<void> {
    // Schedule cleaning before guest arrival
  }
}

// Repository interfaces (would be implemented with actual database)
interface CleanerRepository {
  findAvailable(start: Date, end: Date, location: { lat: number; lng: number }, radiusMiles: number): Promise<Cleaner[]>;
  findById(id: string): Promise<Cleaner | null>;
  findEmergencyAvailable(startTime: Date): Promise<Cleaner[]>;
}

interface PropertyRepository {
  findById(id: string): Promise<Property | null>;
}

interface CleaningJobRepository {
  create(job: Partial<CleaningJob>): Promise<string>;
  update(id: string, updates: Partial<CleaningJob>): Promise<void>;
  findById(id: string): Promise<CleaningJob | null>;
  findByCleanerAndProperty(cleanerId: string, propertyId: string): Promise<CleaningJob[]>;
  addTimelineEvent(jobId: string, event: any): Promise<void>;
}

interface AvailabilityRepository {
  getAvailability(cleanerId: string, date: Date): Promise<CleanerAvailability | null>;
}

interface NotificationService {
  notifyCleaner(cleanerId: string, notification: any): Promise<void>;
  notifyHost(propertyId: string, notification: any): Promise<void>;
  escalateToHost(propertyId: string, escalation: any): Promise<void>;
}