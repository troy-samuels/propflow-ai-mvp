/**
 * Event-Driven Architecture Core
 * Handles all inter-service communication
 */

export enum EventType {
  // Property Events
  GUEST_CHECKOUT = 'guest.checkout',
  GUEST_CHECKIN_PENDING = 'guest.checkin_pending',
  BOOKING_CONFIRMED = 'booking.confirmed',
  
  // Cleaning Events
  CLEANING_REQUIRED = 'cleaning.required',
  CLEANER_ASSIGNED = 'cleaner.assigned',
  CLEANER_UNAVAILABLE = 'cleaner.unavailable',
  CLEANING_COMPLETED = 'cleaning.completed',
  CLEANING_VERIFIED = 'cleaning.verified',
  
  // Pricing Events
  MARKET_EVENT_DETECTED = 'pricing.market_event_detected',
  PRICE_OPTIMIZATION_READY = 'pricing.optimization_ready',
  
  // Guest Communication Events
  GUEST_MESSAGE_RECEIVED = 'guest.message_received',
  AUTO_RESPONSE_SENT = 'guest.auto_response_sent',
  
  // Property Monitoring Events
  DAMAGE_DETECTED = 'property.damage_detected',
  UNAUTHORIZED_ACCESS = 'property.unauthorized_access',
}

export interface Event {
  id: string;
  type: EventType;
  propertyId: string;
  timestamp: Date;
  data: Record<string, any>;
  correlationId?: string;
  retries?: number;
}

export interface EventHandler {
  eventTypes: EventType[];
  handle(event: Event): Promise<void>;
}

export class EventBus {
  private handlers: Map<EventType, EventHandler[]> = new Map();
  private eventStore: Event[] = []; // In production: use Redis/RabbitMQ

  register(handler: EventHandler): void {
    handler.eventTypes.forEach(eventType => {
      if (!this.handlers.has(eventType)) {
        this.handlers.set(eventType, []);
      }
      this.handlers.get(eventType)!.push(handler);
    });
  }

  async publish(event: Event): Promise<void> {
    // Store event for replay/audit
    this.eventStore.push(event);
    
    const handlers = this.handlers.get(event.type) || [];
    
    // Process handlers in parallel with error isolation
    await Promise.allSettled(
      handlers.map(async (handler) => {
        try {
          await handler.handle(event);
        } catch (error) {
          console.error(`Handler failed for event ${event.id}:`, error);
          // In production: send to error monitoring service
        }
      })
    );
  }

  // For testing and replay scenarios
  getEvents(propertyId?: string, since?: Date): Event[] {
    return this.eventStore.filter(event => 
      (!propertyId || event.propertyId === propertyId) &&
      (!since || event.timestamp >= since)
    );
  }
}

export const eventBus = new EventBus();