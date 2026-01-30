/**
 * Real-time Events Hook
 * Manages live data streams and contextual intelligence
 */

import { useState, useEffect, useCallback } from 'react';
import { EventBus, EventType } from '../../core/events/EventBus';
import { PropertyAlert } from '../../models';

interface RevenueOpportunity {
  id: string;
  propertyId: string;
  type: 'pricing' | 'availability' | 'event_pricing' | 'competitor_analysis';
  title: string;
  description: string;
  potentialRevenue: number;
  confidence: number;
  expiresAt: Date;
  actionRequired: boolean;
  autoApplicable: boolean;
  factors: string[];
}

interface ActiveAlert {
  id: string;
  propertyId: string;
  type: 'cleaner_no_show' | 'guest_complaint' | 'damage_detected' | 'pricing_underperforming' | 'unauthorized_party';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actionItems: Array<{
    action: string;
    urgency: 'immediate' | 'within_hour' | 'within_day';
    automated: boolean;
  }>;
  estimatedImpact: {
    revenue?: number;
    guestSatisfaction?: number;
    timeline: string;
  };
  createdAt: Date;
  lastUpdated: Date;
}

interface CleaningJobUpdate {
  id: string;
  propertyId: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'verified' | 'failed';
  cleanerName?: string;
  scheduledStart: Date;
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  updates: Array<{
    timestamp: Date;
    event: string;
    details?: string;
  }>;
}

export const useRealTimeEvents = (hostId: string) => {
  const [alerts, setAlerts] = useState<ActiveAlert[]>([]);
  const [opportunities, setOpportunities] = useState<RevenueOpportunity[]>([]);
  const [cleaningJobs, setCleaningJobs] = useState<CleaningJobUpdate[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  // Initialize real-time connection
  useEffect(() => {
    const eventBus = new EventBus();
    
    // Register handlers for different event types
    eventBus.register({
      eventTypes: [
        EventType.CLEANER_UNAVAILABLE,
        EventType.DAMAGE_DETECTED,
        EventType.MARKET_EVENT_DETECTED,
        EventType.PRICE_OPTIMIZATION_READY,
        EventType.CLEANING_COMPLETED,
        EventType.GUEST_MESSAGE_RECEIVED
      ],
      handle: handleRealTimeEvent
    });

    setConnectionStatus('connected');

    // Simulate some initial data
    loadInitialData();

    return () => {
      setConnectionStatus('disconnected');
    };
  }, [hostId]);

  const handleRealTimeEvent = useCallback(async (event: any) => {
    switch (event.type) {
      case EventType.CLEANER_UNAVAILABLE:
        handleCleanerCancellation(event);
        break;
      
      case EventType.DAMAGE_DETECTED:
        handleDamageAlert(event);
        break;
      
      case EventType.MARKET_EVENT_DETECTED:
        handlePricingOpportunity(event);
        break;
      
      case EventType.PRICE_OPTIMIZATION_READY:
        handlePriceOptimization(event);
        break;
      
      case EventType.CLEANING_COMPLETED:
        handleCleaningUpdate(event);
        break;
      
      case EventType.GUEST_MESSAGE_RECEIVED:
        handleGuestCommunication(event);
        break;
    }
  }, []);

  const handleCleanerCancellation = (event: any) => {
    const alert: ActiveAlert = {
      id: `cleaner-cancel-${Date.now()}`,
      propertyId: event.propertyId,
      type: 'cleaner_no_show',
      severity: 'high',
      title: 'Cleaner Cancelled Last Minute',
      description: `${event.data.cleanerName} cancelled cleaning scheduled for ${new Date(event.data.scheduledTime).toLocaleTimeString()}. Auto-searching for backup cleaners.`,
      actionItems: [
        {
          action: 'Assign backup cleaner automatically',
          urgency: 'immediate',
          automated: true
        },
        {
          action: 'Notify host if no backup found',
          urgency: 'immediate',
          automated: true
        }
      ],
      estimatedImpact: {
        guestSatisfaction: -20,
        timeline: 'Next guest arrival in 4 hours'
      },
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    setAlerts(prev => [...prev, alert]);

    // Auto-remove when backup found (simulate)
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== alert.id));
      
      // Add success notification
      const successAlert: ActiveAlert = {
        ...alert,
        id: `backup-found-${Date.now()}`,
        severity: 'low',
        title: 'Backup Cleaner Assigned',
        description: `Maria Santos assigned as backup cleaner. ETA: 3:30 PM`,
        actionItems: []
      };
      
      setAlerts(prev => [...prev, successAlert]);
      
      // Remove success notification after 30 seconds
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== successAlert.id));
      }, 30000);
      
    }, 5000);
  };

  const handleDamageAlert = (event: any) => {
    const alert: ActiveAlert = {
      id: `damage-${Date.now()}`,
      propertyId: event.propertyId,
      type: 'damage_detected',
      severity: 'critical',
      title: 'Property Damage Detected',
      description: `Possible damage detected in living room. Automated photo analysis shows potential furniture damage.`,
      actionItems: [
        {
          action: 'Review damage photos',
          urgency: 'immediate',
          automated: false
        },
        {
          action: 'Contact current guest',
          urgency: 'within_hour',
          automated: false
        },
        {
          action: 'Document for insurance claim',
          urgency: 'within_day',
          automated: true
        }
      ],
      estimatedImpact: {
        revenue: -500,
        timeline: 'Potential guest cancellation risk'
      },
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    setAlerts(prev => [...prev, alert]);
  };

  const handlePricingOpportunity = (event: any) => {
    const opportunity: RevenueOpportunity = {
      id: `pricing-${Date.now()}`,
      propertyId: event.propertyId,
      type: 'event_pricing',
      title: 'Formula 1 Race Weekend Detected',
      description: 'Major sporting event detected near your property. Competitor analysis shows 3x price increase opportunity.',
      potentialRevenue: 2847,
      confidence: 0.94,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      actionRequired: false,
      autoApplicable: true,
      factors: [
        'Formula 1 Monaco Grand Prix (May 26-28)',
        'Hotels in area increased prices by 280%',
        'Similar properties pricing $400-500/night',
        'Your current rate: $120/night'
      ]
    };

    setOpportunities(prev => [...prev, opportunity]);
  };

  const handlePriceOptimization = (event: any) => {
    const opportunity: RevenueOpportunity = {
      id: `optimization-${Date.now()}`,
      propertyId: event.propertyId,
      type: 'pricing',
      title: 'Dynamic Pricing Recommendation',
      description: 'AI analysis suggests price adjustment based on demand patterns and competitor rates.',
      potentialRevenue: 450,
      confidence: 0.87,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      actionRequired: false,
      autoApplicable: true,
      factors: [
        'Weekend demand spike predicted',
        'Competitors raised prices 15%',
        'Your occupancy rate: 94%',
        'Weather forecast: sunny'
      ]
    };

    setOpportunities(prev => [...prev, opportunity]);
  };

  const handleCleaningUpdate = (event: any) => {
    setCleaningJobs(prev => 
      prev.map(job => 
        job.id === event.data.jobId 
          ? {
              ...job,
              status: event.data.status,
              updates: [...job.updates, {
                timestamp: new Date(),
                event: event.data.event,
                details: event.data.details
              }]
            }
          : job
      )
    );
  };

  const handleGuestCommunication = (event: any) => {
    // Check if this requires human attention
    if (event.data.sentiment === 'negative' || event.data.category === 'complaint') {
      const alert: ActiveAlert = {
        id: `guest-issue-${Date.now()}`,
        propertyId: event.propertyId,
        type: 'guest_complaint',
        severity: 'medium',
        title: 'Guest Issue Requires Attention',
        description: `Guest message flagged for human review: "${event.data.content.substring(0, 100)}..."`,
        actionItems: [
          {
            action: 'Review guest message',
            urgency: 'within_hour',
            automated: false
          },
          {
            action: 'Respond personally',
            urgency: 'within_hour',
            automated: false
          }
        ],
        estimatedImpact: {
          guestSatisfaction: -15,
          timeline: 'Response needed within 1 hour'
        },
        createdAt: new Date(),
        lastUpdated: new Date()
      };

      setAlerts(prev => [...prev, alert]);
    }
  };

  const loadInitialData = () => {
    // Simulate some initial opportunities
    const sampleOpportunities: RevenueOpportunity[] = [
      {
        id: 'opp-1',
        propertyId: 'prop-1',
        type: 'pricing',
        title: 'Weekend Rate Optimization',
        description: 'Your weekend rates are 23% below market average for similar properties.',
        potentialRevenue: 680,
        confidence: 0.82,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        actionRequired: false,
        autoApplicable: true,
        factors: [
          'Local events driving demand',
          'Competitor analysis shows higher rates',
          'Your current occupancy: 87%'
        ]
      }
    ];

    setOpportunities(sampleOpportunities);
  };

  // Action handlers
  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  }, []);

  const applyOpportunity = useCallback(async (opportunityId: string) => {
    const opportunity = opportunities.find(o => o.id === opportunityId);
    if (!opportunity) return;

    // Simulate applying the optimization
    console.log(`Applying opportunity: ${opportunity.title}`);
    
    // Remove from opportunities
    setOpportunities(prev => prev.filter(o => o.id !== opportunityId));
    
    // Could add a success notification here
  }, [opportunities]);

  const dismissOpportunity = useCallback((opportunityId: string) => {
    setOpportunities(prev => prev.filter(o => o.id !== opportunityId));
  }, []);

  return {
    alerts,
    opportunities,
    cleaningJobs,
    connectionStatus,
    actions: {
      dismissAlert,
      applyOpportunity,
      dismissOpportunity
    }
  };
};