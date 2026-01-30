/**
 * Property Card Component
 * Contextual information display with smart overlays and quick actions
 */

import React, { useState } from 'react';
import { Property, CleaningJob, PropertyAlert } from '../../models';

interface PropertyCardProps {
  property: PropertyWithContext;
  alerts: PropertyAlert[];
  opportunities: any[];
  cleaningJobs: CleaningJob[];
  onSelect: () => void;
  selected: boolean;
}

interface PropertyWithContext extends Property {
  status: 'occupied' | 'vacant' | 'maintenance' | 'blocked';
  currentGuest?: {
    name: string;
    checkOut: Date;
    rating?: number;
  };
  nextGuest?: {
    name: string;
    checkIn: Date;
    guests: number;
  };
  weeklyRevenue: number;
  revenueChange: number; // percentage change
  occupancyRate: number;
  cleaningStatus: 'clean' | 'needs_cleaning' | 'in_progress' | 'verified';
  nextCleaning?: {
    date: Date;
    cleaner: string;
    status: 'scheduled' | 'confirmed' | 'in_progress';
  };
  priceOptimization?: {
    current: number;
    suggested: number;
    confidence: number;
    reason: string;
  };
  lastActivity: Date;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  alerts,
  opportunities,
  cleaningJobs,
  onSelect,
  selected
}) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
  const highValueOpportunities = opportunities.filter(o => o.potentialRevenue > 500);

  return (
    <div 
      className={`property-card ${property.status} ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      onMouseEnter={() => setShowQuickActions(true)}
      onMouseLeave={() => setShowQuickActions(false)}
    >
      {/* Critical alerts overlay */}
      {criticalAlerts.length > 0 && (
        <div className="alert-overlay">
          <span className="alert-badge">{criticalAlerts.length}</span>
          <span className="alert-text">
            {criticalAlerts[0].type === 'damage' ? '🚨 Damage Alert' : '⚠️ Attention Needed'}
          </span>
        </div>
      )}

      {/* Revenue opportunity overlay */}
      {highValueOpportunities.length > 0 && (
        <div className="opportunity-overlay">
          <span className="opportunity-amount">
            +${highValueOpportunities[0].potentialRevenue}
          </span>
          <span className="opportunity-reason">
            {highValueOpportunities[0].type === 'pricing' ? '💰 Price Too Low' : '📈 Revenue Boost'}
          </span>
        </div>
      )}

      {/* Property header */}
      <div className="property-header">
        <div className="property-title">
          <h3>{property.name}</h3>
          <span className="property-type">{property.type}</span>
        </div>
        <div className="property-status">
          <StatusIndicator 
            status={property.status}
            currentGuest={property.currentGuest}
            nextGuest={property.nextGuest}
          />
        </div>
      </div>

      {/* Main content grid */}
      <div className="property-content">
        {/* Current status section */}
        <div className="status-section">
          <div className="occupancy-status">
            {property.status === 'occupied' && property.currentGuest ? (
              <div className="guest-info">
                <span className="guest-name">{property.currentGuest.name}</span>
                <span className="checkout-time">
                  Checkout: {formatTime(property.currentGuest.checkOut)}
                </span>
                {property.currentGuest.rating && (
                  <span className="guest-rating">⭐ {property.currentGuest.rating}/5</span>
                )}
              </div>
            ) : property.status === 'vacant' && property.nextGuest ? (
              <div className="next-guest-info">
                <span className="next-guest">Next: {property.nextGuest.name}</span>
                <span className="checkin-time">
                  {formatTime(property.nextGuest.checkIn)}
                </span>
                <span className="guest-count">{property.nextGuest.guests} guests</span>
              </div>
            ) : (
              <div className="vacant-info">
                <span className="vacant-label">Available</span>
                {property.nextGuest && (
                  <span className="next-booking">
                    Next booking: {formatDate(property.nextGuest.checkIn)}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="cleaning-status">
            <CleaningStatusIndicator 
              status={property.cleaningStatus}
              nextCleaning={property.nextCleaning}
            />
          </div>
        </div>

        {/* Revenue & performance section */}
        <div className="performance-section">
          <div className="revenue-info">
            <span className="revenue-amount">${property.weeklyRevenue.toLocaleString()}</span>
            <span className="revenue-period">Last 7 days</span>
            <span className={`revenue-change ${property.revenueChange >= 0 ? 'positive' : 'negative'}`}>
              {property.revenueChange >= 0 ? '+' : ''}{property.revenueChange.toFixed(1)}%
            </span>
          </div>
          
          <div className="occupancy-rate">
            <span className="rate-value">{property.occupancyRate}%</span>
            <span className="rate-label">Occupancy</span>
          </div>
        </div>

        {/* Smart suggestions section */}
        {property.priceOptimization && property.priceOptimization.confidence > 0.7 && (
          <div className="price-suggestion">
            <div className="suggestion-header">
              <span className="suggestion-icon">💡</span>
              <span className="suggestion-title">Pricing Opportunity</span>
            </div>
            <div className="suggestion-content">
              <span className="current-price">${property.priceOptimization.current}</span>
              <span className="arrow">→</span>
              <span className="suggested-price">${property.priceOptimization.suggested}</span>
              <span className="confidence">
                {(property.priceOptimization.confidence * 100).toFixed(0)}% sure
              </span>
            </div>
            <div className="suggestion-reason">
              {property.priceOptimization.reason}
            </div>
          </div>
        )}
      </div>

      {/* Quick actions overlay (appears on hover) */}
      {showQuickActions && (
        <div className="quick-actions-overlay">
          <QuickActionButton 
            icon="📅"
            label="Calendar"
            onClick={(e) => handleQuickAction(e, 'calendar')}
          />
          <QuickActionButton 
            icon="💬"
            label="Message Guest"
            onClick={(e) => handleQuickAction(e, 'message')}
            disabled={!property.currentGuest}
          />
          <QuickActionButton 
            icon="🧹"
            label="Schedule Cleaning"
            onClick={(e) => handleQuickAction(e, 'cleaning')}
          />
          <QuickActionButton 
            icon="💰"
            label="Adjust Price"
            onClick={(e) => handleQuickAction(e, 'pricing')}
          />
        </div>
      )}

      {/* Last activity timestamp */}
      <div className="last-activity">
        Last update: {formatRelativeTime(property.lastActivity)}
      </div>
    </div>
  );

  function handleQuickAction(e: React.MouseEvent, action: string) {
    e.stopPropagation();
    // Handle quick actions
    console.log(`Quick action: ${action} for property ${property.id}`);
  }
};

const StatusIndicator: React.FC<{
  status: string;
  currentGuest?: any;
  nextGuest?: any;
}> = ({ status, currentGuest, nextGuest }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'occupied': return 'green';
      case 'vacant': return 'blue';
      case 'maintenance': return 'orange';
      case 'blocked': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'occupied': return 'OCCUPIED';
      case 'vacant': return nextGuest ? 'TURNOVER' : 'AVAILABLE';
      case 'maintenance': return 'MAINTENANCE';
      case 'blocked': return 'BLOCKED';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className={`status-indicator ${getStatusColor()}`}>
      <div className="status-dot"></div>
      <span className="status-text">{getStatusText()}</span>
    </div>
  );
};

const CleaningStatusIndicator: React.FC<{
  status: string;
  nextCleaning?: any;
}> = ({ status, nextCleaning }) => {
  const getCleaningIcon = () => {
    switch (status) {
      case 'clean': return '✅';
      case 'needs_cleaning': return '🧹';
      case 'in_progress': return '⏳';
      case 'verified': return '🔍';
      default: return '❓';
    }
  };

  const getCleaningText = () => {
    if (nextCleaning) {
      const timeUntil = nextCleaning.date.getTime() - Date.now();
      const hoursUntil = Math.round(timeUntil / (1000 * 60 * 60));
      
      if (hoursUntil < 1) return 'Cleaning soon';
      if (hoursUntil < 24) return `${hoursUntil}h until cleaning`;
      return formatDate(nextCleaning.date);
    }
    
    switch (status) {
      case 'clean': return 'Clean & Ready';
      case 'needs_cleaning': return 'Needs Cleaning';
      case 'in_progress': return 'Being Cleaned';
      case 'verified': return 'Verified Clean';
      default: return 'Unknown Status';
    }
  };

  return (
    <div className={`cleaning-status ${status}`}>
      <span className="cleaning-icon">{getCleaningIcon()}</span>
      <span className="cleaning-text">{getCleaningText()}</span>
      {nextCleaning && nextCleaning.cleaner && (
        <span className="cleaner-name">by {nextCleaning.cleaner}</span>
      )}
    </div>
  );
};

const QuickActionButton: React.FC<{
  icon: string;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
}> = ({ icon, label, onClick, disabled = false }) => (
  <button 
    className={`quick-action-btn ${disabled ? 'disabled' : ''}`}
    onClick={onClick}
    disabled={disabled}
    title={label}
  >
    <span className="action-icon">{icon}</span>
    <span className="action-label">{label}</span>
  </button>
);

// Utility functions
const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};

const formatRelativeTime = (date: Date): string => {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return formatDate(date);
};