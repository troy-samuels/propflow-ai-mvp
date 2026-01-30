/**
 * PropFlow AI MVP - Premium Dashboard
 * Professional, modern UI for property management
 */

import React, { useState, useEffect } from 'react';
import '../styles/DesignSystem.css';
import './PremiumDashboard.css';

// Data interfaces with enhanced typing
interface Property {
  id: string;
  name: string;
  weeklyRevenue: number;
  status: 'good' | 'needs-attention' | 'cleaning';
  cleanerName?: string;
  cleaningTime?: string;
  nextGuest?: string;
  guestArrivalTime?: string;
  unhandledMessages: number;
  isClean: boolean;
  imageUrl?: string;
  occupancyRate: number;
  lastUpdated: string;
}

interface RevenueOpportunity {
  id: string;
  event: string;
  extraMoney: number;
  confidence: number;
  timeRemaining: string;
  category: string;
}

interface MagicStats {
  autoHandledMessages: number;
  revenueOptimizations: number;
  cleanersAutoBooked: number;
  calendarConflictsResolved: number;
  totalTimeSaved: number;
  weeklyExtraRevenue: number;
  automationPercentage: number;
}

const PremiumPropFlowDashboard: React.FC = () => {
  // Enhanced state management
  const [properties, setProperties] = useState<Property[]>([]);
  const [opportunity, setOpportunity] = useState<RevenueOpportunity | null>(null);
  const [magicStats, setMagicStats] = useState<MagicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Enhanced data loading with real API integration
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load from actual backend API
      const response = await fetch('/api/dashboard/premium');
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || getMockProperties());
        setOpportunity(data.money_opportunity || getMockOpportunity());
        setMagicStats(data.magic_stats || getMockMagicStats());
      } else {
        // Fallback to enhanced mock data
        setProperties(getMockProperties());
        setOpportunity(getMockOpportunity());
        setMagicStats(getMockMagicStats());
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Enhanced fallback data
      setProperties(getMockProperties());
      setOpportunity(getMockOpportunity());
      setMagicStats(getMockMagicStats());
    } finally {
      setLoading(false);
    }
  };

  // Enhanced mock data with more realistic details
  const getMockProperties = (): Property[] => [
    {
      id: '1',
      name: 'Manhattan Luxury Loft',
      weeklyRevenue: 2847,
      status: 'good',
      cleanerName: 'Maria Rodriguez',
      cleaningTime: 'Today 3:00 PM',
      nextGuest: 'Jake & Sarah Morrison',
      guestArrivalTime: 'Tomorrow 3:00 PM',
      unhandledMessages: 0,
      isClean: false,
      occupancyRate: 94,
      lastUpdated: '2 minutes ago',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop'
    },
    {
      id: '2',
      name: 'Brooklyn Townhouse',
      weeklyRevenue: 1923,
      status: 'needs-attention',
      cleanerName: 'Carlos Silva',
      cleaningTime: 'Friday 2:00 PM',
      nextGuest: 'Available for booking',
      guestArrivalTime: '',
      unhandledMessages: 2,
      isClean: true,
      occupancyRate: 78,
      lastUpdated: '5 minutes ago',
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop'
    },
    {
      id: '3',
      name: 'SoHo Studio',
      weeklyRevenue: 1250,
      status: 'good',
      cleanerName: 'Elena Chang',
      cleaningTime: 'Wednesday 10:00 AM',
      nextGuest: 'Business Traveler',
      guestArrivalTime: 'Tonight 8:00 PM',
      unhandledMessages: 0,
      isClean: true,
      occupancyRate: 85,
      lastUpdated: '1 minute ago',
      imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=250&fit=crop'
    }
  ];

  const getMockOpportunity = (): RevenueOpportunity => ({
    id: '1',
    event: '🏎️ Formula 1 Race Weekend',
    extraMoney: 2847,
    confidence: 94,
    timeRemaining: '48 hours',
    category: 'Major Sports Event'
  });

  const getMockMagicStats = (): MagicStats => ({
    autoHandledMessages: 47,
    revenueOptimizations: 8,
    cleanersAutoBooked: 12,
    calendarConflictsResolved: 3,
    totalTimeSaved: 12.5,
    weeklyExtraRevenue: 8650,
    automationPercentage: 94
  });

  // Enhanced revenue optimization with animation
  const handleOptimizeRevenue = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/apply-pricing', { method: 'POST' });
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Update revenue optimistically
        if (opportunity) {
          setProperties(prev => 
            prev.map(p => ({
              ...p,
              weeklyRevenue: p.weeklyRevenue + (opportunity.extraMoney / 3)
            }))
          );
        }
      }
    } catch (error) {
      console.error('Failed to optimize pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency with proper styling
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="body-base">Loading your property portfolio...</p>
      </div>
    );
  }

  const totalRevenue = properties.reduce((sum, p) => sum + p.weeklyRevenue, 0);
  const averageOccupancy = Math.round(
    properties.reduce((sum, p) => sum + p.occupancyRate, 0) / properties.length
  );

  return (
    <div className="premium-dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="container">
          <div className="flex-between">
            <div>
              <h1 className="heading-1">PropFlow AI</h1>
              <p className="body-large">Professional Property Management</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-secondary">
                <span>⚙️</span>
                Settings
              </button>
              <button className="btn btn-primary">
                <span>➕</span>
                Add Property
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main container">
        {/* Success Message */}
        {showSuccess && (
          <div className="success-banner animate-slide-up">
            <span>🎉</span>
            <span>Revenue optimization applied successfully!</span>
          </div>
        )}

        {/* KPI Overview */}
        <section className="kpi-section">
          <div className="grid-dashboard">
            <div className="kpi-card col-span-3">
              <div className="kpi-icon revenue-icon">💰</div>
              <div className="kpi-content">
                <p className="caption">Weekly Revenue</p>
                <h3 className="heading-3">{formatCurrency(totalRevenue)}</h3>
                <p className="kpi-change positive">+12.5% from last week</p>
              </div>
            </div>
            
            <div className="kpi-card col-span-3">
              <div className="kpi-icon occupancy-icon">📊</div>
              <div className="kpi-content">
                <p className="caption">Average Occupancy</p>
                <h3 className="heading-3">{averageOccupancy}%</h3>
                <p className="kpi-change positive">+5.2% from last month</p>
              </div>
            </div>
            
            <div className="kpi-card col-span-3">
              <div className="kpi-icon automation-icon">🤖</div>
              <div className="kpi-content">
                <p className="caption">Automation Rate</p>
                <h3 className="heading-3">{magicStats?.automationPercentage}%</h3>
                <p className="kpi-change positive">Industry leading</p>
              </div>
            </div>
            
            <div className="kpi-card col-span-3">
              <div className="kpi-icon savings-icon">⏱️</div>
              <div className="kpi-content">
                <p className="caption">Time Saved</p>
                <h3 className="heading-3">{magicStats?.totalTimeSaved}h</h3>
                <p className="kpi-change">This week</p>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Opportunity */}
        {opportunity && (
          <section className="opportunity-section">
            <div className="opportunity-card card animate-fade-in">
              <div className="opportunity-header">
                <div className="opportunity-badge">
                  <span className="opportunity-icon">⚡</span>
                  <span>Revenue Opportunity</span>
                </div>
                <div className="opportunity-confidence">
                  <span className="confidence-score">{opportunity.confidence}%</span>
                  <span className="confidence-label">Confidence</span>
                </div>
              </div>
              
              <div className="opportunity-content">
                <h3 className="heading-3">{opportunity.event}</h3>
                <div className="opportunity-details">
                  <div className="opportunity-amount">
                    <span className="amount-label">Potential Extra Revenue</span>
                    <span className="amount-value">{formatCurrency(opportunity.extraMoney)}</span>
                  </div>
                  <div className="opportunity-timing">
                    <span className="timing-label">Action Required Within</span>
                    <span className="timing-value">{opportunity.timeRemaining}</span>
                  </div>
                </div>
              </div>
              
              <div className="opportunity-actions">
                <button 
                  className="btn btn-primary btn-large"
                  onClick={handleOptimizeRevenue}
                  disabled={loading}
                >
                  <span>🚀</span>
                  Apply Optimization
                </button>
                <button className="btn btn-secondary">
                  <span>📊</span>
                  View Details
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Property Portfolio */}
        <section className="properties-section">
          <div className="section-header">
            <h2 className="heading-2">Property Portfolio</h2>
            <div className="section-controls">
              <select className="input">
                <option>All Properties</option>
                <option>Occupied</option>
                <option>Available</option>
              </select>
            </div>
          </div>

          <div className="properties-grid">
            {properties.map((property, index) => (
              <div 
                key={property.id} 
                className={`property-card card animate-slide-up ${
                  selectedProperty === property.id ? 'selected' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedProperty(property.id)}
              >
                <div className="property-image">
                  <img 
                    src={property.imageUrl || '/api/placeholder/400/250'} 
                    alt={property.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTI1TDE2MCA5MEwyNDAgOTBMMjAwIDEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                    }}
                  />
                  <div className="property-status">
                    <span className={`status-indicator status-${property.status}`}>
                      {property.status === 'good' && '✅ Excellent'}
                      {property.status === 'needs-attention' && '⚠️ Attention'}
                      {property.status === 'cleaning' && '🧹 Cleaning'}
                    </span>
                  </div>
                  <div className="property-occupancy">
                    {property.occupancyRate}%
                  </div>
                </div>

                <div className="property-content">
                  <div className="property-header">
                    <h4 className="heading-4">{property.name}</h4>
                    <p className="caption">Last updated: {property.lastUpdated}</p>
                  </div>

                  <div className="property-revenue">
                    <span className="revenue-label">Weekly Revenue</span>
                    <span className="revenue-amount">{formatCurrency(property.weeklyRevenue)}</span>
                  </div>

                  <div className="property-details">
                    <div className="detail-item">
                      <span className="detail-icon">🧹</span>
                      <div className="detail-content">
                        <span className="detail-label">Cleaner</span>
                        <span className="detail-value">{property.cleanerName}</span>
                        <span className="detail-time">{property.cleaningTime}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">👥</span>
                      <div className="detail-content">
                        <span className="detail-label">Next Guest</span>
                        <span className="detail-value">{property.nextGuest}</span>
                        <span className="detail-time">{property.guestArrivalTime}</span>
                      </div>
                    </div>

                    {property.unhandledMessages > 0 && (
                      <div className="detail-item attention">
                        <span className="detail-icon">💬</span>
                        <div className="detail-content">
                          <span className="detail-label">Messages</span>
                          <span className="detail-value urgent">
                            {property.unhandledMessages} unhandled
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="property-actions">
                  <button className="btn btn-secondary btn-small">
                    View Details
                  </button>
                  <button className="btn btn-primary btn-small">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Magic Statistics */}
        {magicStats && (
          <section className="magic-section">
            <div className="section-header">
              <h2 className="heading-2">AI Automation Impact</h2>
              <p className="body-base">See how PropFlow AI is optimizing your business</p>
            </div>

            <div className="magic-stats-grid">
              <div className="stat-card card">
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <h4 className="heading-4">{magicStats.autoHandledMessages}</h4>
                  <p className="body-small">Messages Auto-Handled</p>
                  <p className="stat-detail">90% response automation</p>
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h4 className="heading-4">{magicStats.revenueOptimizations}</h4>
                  <p className="body-small">Revenue Optimizations</p>
                  <p className="stat-detail">{formatCurrency(magicStats.weeklyExtraRevenue)} added</p>
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-icon">🧹</div>
                <div className="stat-content">
                  <h4 className="heading-4">{magicStats.cleanersAutoBooked}</h4>
                  <p className="body-small">Cleaners Auto-Scheduled</p>
                  <p className="stat-detail">100% reliability rate</p>
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <h4 className="heading-4">{magicStats.calendarConflictsResolved}</h4>
                  <p className="body-small">Conflicts Resolved</p>
                  <p className="stat-detail">Automatic prevention</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default PremiumPropFlowDashboard;