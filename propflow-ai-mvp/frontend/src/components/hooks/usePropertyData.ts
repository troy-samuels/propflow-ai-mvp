/**
 * Property Data Hook
 * Manages property data fetching, caching, and real-time updates
 */

import { useState, useEffect, useCallback } from 'react';
import { Property } from '../../models';

interface PropertyWithMetrics extends Property {
  status: 'occupied' | 'vacant' | 'maintenance' | 'blocked';
  currentGuest?: {
    id: string;
    name: string;
    checkOut: Date;
    rating?: number;
    contact: string;
  };
  nextGuest?: {
    id: string;
    name: string;
    checkIn: Date;
    guests: number;
    contact: string;
  };
  weeklyRevenue: number;
  revenueChange: number; // percentage change from previous week
  occupancyRate: number;
  averageDailyRate: number;
  guestRating: number;
  cleaningStatus: 'clean' | 'needs_cleaning' | 'in_progress' | 'verified';
  nextCleaning?: {
    id: string;
    date: Date;
    cleaner: string;
    status: 'scheduled' | 'confirmed' | 'in_progress';
    type: 'standard' | 'deep' | 'maintenance';
  };
  assignedCleaner?: {
    id: string;
    name: string;
    rating: number;
    photo: string;
    status: 'available' | 'busy' | 'offline';
  };
  priceOptimization?: {
    current: number;
    suggested: number;
    confidence: number;
    reason: string;
    factors: string[];
  };
  recentActivity: Array<{
    time: string;
    description: string;
    type: 'booking' | 'cleaning' | 'pricing' | 'guest' | 'maintenance';
  }>;
  lastActivity: Date;
  
  // Performance metrics
  metrics: {
    bookingsTotalValue: number;
    averageStayLength: number;
    cancellationRate: number;
    repeatGuestRate: number;
    responseTime: number;
    maintenanceIssues: number;
  };
  
  // Predictive insights
  insights: Array<{
    type: 'revenue' | 'operational' | 'guest_experience' | 'market';
    priority: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    confidence: number;
    impact: string;
  }>;
}

export const usePropertyData = (hostId: string) => {
  const [properties, setProperties] = useState<PropertyWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadPropertyData();
    
    // Set up real-time updates
    const updateInterval = setInterval(() => {
      refreshPropertyMetrics();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(updateInterval);
  }, [hostId]);

  const loadPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // In production, this would be API calls
      const mockProperties: PropertyWithMetrics[] = [
        {
          // Basic property info
          id: 'prop-1',
          hostId,
          name: 'Manhattan Loft',
          address: {
            street: '123 West Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            coordinates: { lat: 40.7589, lng: -73.9851 }
          },
          type: 'apartment',
          bedrooms: 2,
          bathrooms: 2,
          maxGuests: 4,
          amenities: ['WiFi', 'Kitchen', 'Washer', 'AC', 'Gym'],
          cleaningRequirements: {
            standardDuration: 120,
            deepCleaningDuration: 180,
            specialInstructions: ['Steam clean bathroom', 'Replace linens'],
            requiredSupplies: ['Eco-friendly products', 'Fresh towels']
          },
          platforms: [
            { platform: 'airbnb', propertyId: 'airbnb-123', active: true },
            { platform: 'vrbo', propertyId: 'vrbo-456', active: true }
          ],
          createdAt: new Date('2023-01-15'),
          updatedAt: new Date(),

          // Real-time status
          status: 'occupied',
          currentGuest: {
            id: 'guest-1',
            name: 'Jake & Sarah',
            checkOut: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
            rating: 4.8,
            contact: '+1-555-0123'
          },
          nextGuest: {
            id: 'guest-2',
            name: 'Michael Chen',
            checkIn: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
            guests: 2,
            contact: '+1-555-0124'
          },

          // Financial metrics
          weeklyRevenue: 2847,
          revenueChange: 12.3,
          occupancyRate: 87,
          averageDailyRate: 245,
          guestRating: 4.9,

          // Cleaning status
          cleaningStatus: 'needs_cleaning',
          nextCleaning: {
            id: 'clean-1',
            date: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours from now
            cleaner: 'Maria Santos',
            status: 'confirmed',
            type: 'standard'
          },
          assignedCleaner: {
            id: 'cleaner-1',
            name: 'Maria Santos',
            rating: 4.9,
            photo: '/api/photos/maria.jpg',
            status: 'available'
          },

          // Pricing optimization
          priceOptimization: {
            current: 180,
            suggested: 220,
            confidence: 0.89,
            reason: 'Formula 1 weekend driving high demand',
            factors: [
              'F1 Monaco GP this weekend',
              'Hotel rates up 280%',
              'Limited availability in area'
            ]
          },

          // Recent activity
          recentActivity: [
            { time: '2h ago', description: 'Guest checked in', type: 'guest' },
            { time: '4h ago', description: 'Cleaning completed by Maria', type: 'cleaning' },
            { time: '6h ago', description: 'Price adjusted to $220/night', type: 'pricing' },
            { time: '1d ago', description: 'New booking confirmed', type: 'booking' }
          ],
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),

          // Performance metrics
          metrics: {
            bookingsTotalValue: 45820,
            averageStayLength: 3.2,
            cancellationRate: 2.1,
            repeatGuestRate: 23.4,
            responseTime: 18,
            maintenanceIssues: 1
          },

          // AI-generated insights
          insights: [
            {
              type: 'revenue',
              priority: 'high',
              title: 'Weekend Rate Optimization',
              description: 'You could increase weekend rates by 25% based on demand patterns',
              confidence: 0.85,
              impact: '+$680/month potential revenue'
            },
            {
              type: 'operational',
              priority: 'medium',
              title: 'Cleaning Efficiency',
              description: 'Maria completes cleanings 20% faster than average',
              confidence: 0.92,
              impact: 'Consider giving her priority bookings'
            }
          ]
        },

        {
          // Second property - different status
          id: 'prop-2',
          hostId,
          name: 'Brooklyn House',
          address: {
            street: '456 Oak Avenue',
            city: 'Brooklyn',
            state: 'NY',
            zipCode: '11201',
            coordinates: { lat: 40.6892, lng: -73.9442 }
          },
          type: 'house',
          bedrooms: 3,
          bathrooms: 2.5,
          maxGuests: 6,
          amenities: ['WiFi', 'Kitchen', 'Parking', 'Garden', 'BBQ'],
          cleaningRequirements: {
            standardDuration: 150,
            deepCleaningDuration: 240,
            specialInstructions: ['Clean outdoor furniture', 'Maintain garden'],
            requiredSupplies: ['Garden maintenance tools', 'Outdoor cleaners']
          },
          platforms: [
            { platform: 'airbnb', propertyId: 'airbnb-789', active: true }
          ],
          createdAt: new Date('2023-03-20'),
          updatedAt: new Date(),

          // Different status - vacant
          status: 'vacant',
          currentGuest: undefined,
          nextGuest: {
            id: 'guest-3',
            name: 'Thompson Family',
            checkIn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            guests: 4,
            contact: '+1-555-0125'
          },

          // Financial metrics
          weeklyRevenue: 1923,
          revenueChange: -5.2,
          occupancyRate: 72,
          averageDailyRate: 195,
          guestRating: 4.7,

          // Cleaning status
          cleaningStatus: 'clean',
          nextCleaning: {
            id: 'clean-2',
            date: new Date(Date.now() + 36 * 60 * 60 * 1000), // 36 hours from now
            cleaner: 'Carlos Rodriguez',
            status: 'scheduled',
            type: 'maintenance'
          },
          assignedCleaner: {
            id: 'cleaner-2',
            name: 'Carlos Rodriguez',
            rating: 4.7,
            photo: '/api/photos/carlos.jpg',
            status: 'available'
          },

          // Pricing insight
          priceOptimization: {
            current: 165,
            suggested: 195,
            confidence: 0.76,
            reason: 'Below market rate for similar properties',
            factors: [
              'Comparable houses pricing $195-220',
              'Your property has unique garden amenity',
              'Weekend demand typically higher'
            ]
          },

          // Recent activity
          recentActivity: [
            { time: '1d ago', description: 'Guest checked out', type: 'guest' },
            { time: '1d ago', description: 'Quality check completed', type: 'cleaning' },
            { time: '3d ago', description: 'Maintenance request resolved', type: 'maintenance' }
          ],
          lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),

          // Performance metrics
          metrics: {
            bookingsTotalValue: 32400,
            averageStayLength: 4.1,
            cancellationRate: 3.8,
            repeatGuestRate: 18.2,
            responseTime: 12,
            maintenanceIssues: 0
          },

          // AI insights
          insights: [
            {
              type: 'market',
              priority: 'medium',
              title: 'Pricing Below Market',
              description: 'Your rates are 15% below similar properties in the area',
              confidence: 0.81,
              impact: '+$450/month potential revenue'
            },
            {
              type: 'guest_experience',
              priority: 'low',
              title: 'Garden Feature Underutilized',
              description: 'Guests love the garden - consider highlighting it more in photos',
              confidence: 0.73,
              impact: 'Could improve booking rate by 8%'
            }
          ]
        }
      ];

      setProperties(mockProperties);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property data');
    } finally {
      setLoading(false);
    }
  };

  const refreshPropertyMetrics = useCallback(async () => {
    // In production, this would update only the metrics/real-time data
    // For now, we'll simulate some metric updates
    setProperties(prev => prev.map(property => ({
      ...property,
      weeklyRevenue: property.weeklyRevenue + Math.random() * 10 - 5,
      lastActivity: Math.random() > 0.7 ? new Date() : property.lastActivity
    })));
    
    setLastUpdate(new Date());
  }, []);

  const updatePropertyStatus = useCallback((propertyId: string, status: any) => {
    setProperties(prev => prev.map(property =>
      property.id === propertyId
        ? { ...property, ...status, lastActivity: new Date() }
        : property
    ));
  }, []);

  const getPropertyById = useCallback((propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  }, [properties]);

  const getPropertiesByStatus = useCallback((status: string) => {
    return properties.filter(p => p.status === status);
  }, [properties]);

  const getTotalMetrics = useCallback(() => {
    return {
      totalRevenue: properties.reduce((sum, p) => sum + p.weeklyRevenue, 0),
      averageOccupancy: properties.reduce((sum, p) => sum + p.occupancyRate, 0) / properties.length,
      totalBookings: properties.reduce((sum, p) => sum + p.metrics.bookingsTotalValue, 0),
      averageRating: properties.reduce((sum, p) => sum + p.guestRating, 0) / properties.length
    };
  }, [properties]);

  return {
    properties,
    loading,
    error,
    lastUpdate,
    actions: {
      refresh: loadPropertyData,
      updatePropertyStatus,
      getPropertyById,
      getPropertiesByStatus,
      getTotalMetrics
    }
  };
};