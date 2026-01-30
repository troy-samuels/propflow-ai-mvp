/**
 * Core Data Models for PropFlow AI
 */

export interface Property {
  id: string;
  hostId: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: { lat: number; lng: number };
  };
  type: 'apartment' | 'house' | 'condo' | 'villa';
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  cleaningRequirements: {
    standardDuration: number; // minutes
    deepCleaningDuration: number;
    specialInstructions: string[];
    requiredSupplies: string[];
  };
  platforms: Array<{
    platform: 'airbnb' | 'vrbo' | 'booking' | 'direct';
    propertyId: string;
    active: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cleaner {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  serviceArea: {
    coordinates: { lat: number; lng: number };
    radiusMiles: number;
  };
  availability: {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
  };
  qualityScore: number; // 1-10 based on reviews and performance
  rates: {
    standardCleaning: number; // per hour
    deepCleaning: number;
    emergencyRate: number; // rush jobs
  };
  verified: boolean;
  backgroundCheck: boolean;
  insurance: boolean;
  supplies: string[]; // what they can provide
  specialties: string[]; // pet-friendly, eco-friendly, etc.
  metrics: {
    completedJobs: number;
    averageRating: number;
    onTimePercentage: number;
    cancellationRate: number;
    responseTimeMinutes: number;
  };
  status: 'available' | 'busy' | 'offline';
  lastActiveAt: Date;
  createdAt: Date;
}

export interface TimeSlot {
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

export interface Booking {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  platform: string;
  platformBookingId: string;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  specialRequests: string[];
  totalAmount: number;
  createdAt: Date;
}

export interface CleaningJob {
  id: string;
  propertyId: string;
  bookingId?: string; // null for maintenance cleaning
  type: 'standard' | 'deep' | 'maintenance' | 'emergency';
  scheduledStart: Date;
  scheduledEnd: Date;
  assignedCleaner?: string; // cleaner ID
  backupCleaners: string[]; // ordered list of backup options
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'verified' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requirements: {
    estimatedDuration: number;
    specialInstructions: string[];
    supplies: string[];
    access: {
      method: 'lockbox' | 'keypad' | 'concierge' | 'manual';
      details: string;
    };
  };
  pricing: {
    baseRate: number;
    actualCost?: number;
    emergencyFee?: number;
  };
  quality: {
    beforePhotos: string[];
    afterPhotos: string[];
    checklist: Array<{
      item: string;
      completed: boolean;
      notes?: string;
    }>;
    hostRating?: number;
    hostFeedback?: string;
    issues: Array<{
      description: string;
      severity: 'minor' | 'major' | 'critical';
      resolved: boolean;
    }>;
  };
  timeline: Array<{
    timestamp: Date;
    event: string;
    details?: string;
    actor: string; // cleaner ID, system, host ID
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CleanerAvailability {
  cleanerId: string;
  date: string; // YYYY-MM-DD format
  slots: Array<{
    startTime: string;
    endTime: string;
    available: boolean;
    jobId?: string; // if booked
  }>;
  exceptions: Array<{
    startTime: Date;
    endTime: Date;
    reason: string;
    type: 'unavailable' | 'emergency_only';
  }>;
}

export interface PriceIntelligence {
  propertyId: string;
  date: string;
  basePrice: number;
  suggestedPrice: number;
  confidence: number; // 0-1
  factors: Array<{
    factor: string;
    impact: number; // percentage change
    description: string;
  }>;
  competitors: Array<{
    platform: string;
    similarPropertyPrice: number;
    occupancyRate: number;
  }>;
  events: Array<{
    name: string;
    date: Date;
    impact: 'high' | 'medium' | 'low';
    priceMultiplier: number;
  }>;
  updatedAt: Date;
}

export interface GuestCommunication {
  id: string;
  propertyId: string;
  bookingId: string;
  direction: 'inbound' | 'outbound';
  channel: 'airbnb' | 'vrbo' | 'sms' | 'email' | 'whatsapp';
  content: string;
  timestamp: Date;
  automated: boolean;
  sentiment?: 'positive' | 'neutral' | 'negative';
  category?: 'wifi' | 'checkin' | 'amenities' | 'complaint' | 'checkout' | 'other';
  handled: boolean;
  responseTemplate?: string;
}

export interface PropertyAlert {
  id: string;
  propertyId: string;
  type: 'damage' | 'unauthorized_access' | 'noise_complaint' | 'emergency' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  evidence: {
    photos: string[];
    videos: string[];
    sensorData: Record<string, any>;
    timestamp: Date;
  };
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string; // user ID or "system"
  resolution?: {
    action: string;
    cost?: number;
    resolvedBy: string;
    resolvedAt: Date;
  };
  createdAt: Date;
}