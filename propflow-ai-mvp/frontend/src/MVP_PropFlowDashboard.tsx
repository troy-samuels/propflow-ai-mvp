/**
 * PropFlow AI MVP - "8-Year-Old Simple" Dashboard
 * Zero manual, pure automation, visual simplicity
 */

import React, { useState, useEffect } from 'react';
import './MVP_PropFlow.css';

// Simple data types - no complex interfaces
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
}

interface MoneyOpportunity {
  id: string;
  event: string;
  extraMoney: number;
  confidence: number;
}

const PropFlowMVP: React.FC = () => {
  // Simple state - no complex data management
  const [properties, setProperties] = useState<Property[]>([]);
  const [moneyOpportunity, setMoneyOpportunity] = useState<MoneyOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load data automatically - no user configuration needed
  useEffect(() => {
    loadMagicData();
  }, []);

  const loadMagicData = () => {
    // Simulate loading real data (in production, this calls APIs)
    setTimeout(() => {
      setProperties([
        {
          id: '1',
          name: 'Manhattan Loft',
          weeklyRevenue: 2847,
          status: 'good',
          cleanerName: 'Maria',
          cleaningTime: '3:00 PM',
          nextGuest: 'Jake & Sarah',
          guestArrivalTime: '3:00 PM',
          unhandledMessages: 0,
          isClean: false
        },
        {
          id: '2', 
          name: 'Brooklyn House',
          weeklyRevenue: 1923,
          status: 'needs-attention',
          cleanerName: 'Carlos',
          cleaningTime: 'Friday 2:00 PM',
          nextGuest: 'Ready for guests',
          guestArrivalTime: '',
          unhandledMessages: 1,
          isClean: true
        }
      ]);

      setMoneyOpportunity({
        id: '1',
        event: '🏎️ Formula 1 Race This Weekend!',
        extraMoney: 2847,
        confidence: 0.94
      });

      setLoading(false);
    }, 1000);
  };

  // Big green button actions - one click does everything
  const makeExtraMoney = async () => {
    setShowCelebration(true);
    
    // Auto-apply optimal pricing (no forms, no settings)
    await applyOptimalPricing(moneyOpportunity!);
    
    // Remove opportunity after applying
    setMoneyOpportunity(null);
    
    // Show celebration for 3 seconds
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const applyOptimalPricing = async (opportunity: MoneyOpportunity) => {
    // In production: calls API to update pricing across all platforms
    console.log(`🤖 Auto-updating prices for ${opportunity.event}`);
    
    // Update properties to show new revenue
    setProperties(prev => prev.map(p => ({
      ...p,
      weeklyRevenue: p.weeklyRevenue + 200 // Show immediate visual feedback
    })));
  };

  const helpGuest = (propertyId: string) => {
    // Open simple guest help interface (not shown in MVP)
    console.log(`🤝 Helping guest at property ${propertyId}`);
    
    // Mark messages as handled
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, unhandledMessages: 0, status: 'good' } : p
    ));
  };

  if (loading) {
    return (
      <div className="mvp-loading">
        <div className="loading-spinner">🏠</div>
        <div className="loading-text">Setting up your property magic...</div>
      </div>
    );
  }

  return (
    <div className="mvp-dashboard">
      {/* Header - Always positive and encouraging */}
      <div className="mvp-header">
        <h1>🏠 PropFlow - Your Properties Are Happy!</h1>
        <div className="overall-status">
          😊 All Good
        </div>
      </div>

      {/* Celebration overlay when money is made */}
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            🎉 You Made Extra Money! 🎉
            <div className="celebration-amount">+${moneyOpportunity?.extraMoney}</div>
          </div>
        </div>
      )}

      {/* Money opportunity - only show when there's a clear win */}
      {moneyOpportunity && (
        <div className="money-opportunity">
          <div className="opportunity-header">
            💰 You Can Make Extra Money!
          </div>
          <div className="opportunity-card">
            <div className="event-name">{moneyOpportunity.event}</div>
            <div className="money-amount">Make ${moneyOpportunity.extraMoney.toLocaleString()} more</div>
            <div className="opportunity-actions">
              <button className="big-green-button" onClick={makeExtraMoney}>
                YES, DO IT! 💰
              </button>
              <button className="small-gray-button" onClick={() => setMoneyOpportunity(null)}>
                No thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Properties - visual cards showing everything at a glance */}
      <div className="properties-section">
        <div className="properties-grid">
          {properties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onHelpGuest={() => helpGuest(property.id)}
            />
          ))}
        </div>
      </div>

      {/* Important alerts - only show critical stuff */}
      <div className="important-section">
        <h2>🚨 Important Stuff</h2>
        <div className="all-good-message">
          Nothing right now - you're doing great! 🎉
        </div>
      </div>
    </div>
  );
};

// Property card component - shows everything visually
const PropertyCard: React.FC<{
  property: Property;
  onHelpGuest: () => void;
}> = ({ property, onHelpGuest }) => {
  const getStatusEmoji = () => {
    switch (property.status) {
      case 'good': return '😊';
      case 'needs-attention': return '⚠️';
      case 'cleaning': return '🧹';
      default: return '😊';
    }
  };

  const getCleaningStatus = () => {
    if (property.isClean) {
      return (
        <div className="status-item good">
          ✅ Clean and ready!
        </div>
      );
    } else {
      return (
        <div className="status-item cleaning">
          🧹 {property.cleanerName} cleaning at {property.cleaningTime}
        </div>
      );
    }
  };

  const getGuestStatus = () => {
    if (property.unhandledMessages > 0) {
      return (
        <div className="status-item needs-attention">
          💬 {property.unhandledMessages} guest needs help
        </div>
      );
    } else {
      return (
        <div className="status-item good">
          💬 All messages handled ✅
        </div>
      );
    }
  };

  const getNextGuestStatus = () => {
    if (property.nextGuest === 'Ready for guests') {
      return (
        <div className="status-item good">
          👥 Ready for guests ✅
        </div>
      );
    } else {
      return (
        <div className="status-item info">
          👥 {property.nextGuest} arrives at {property.guestArrivalTime}
        </div>
      );
    }
  };

  return (
    <div className={`property-card ${property.status}`}>
      {/* Property name with status emoji */}
      <div className="property-header">
        <h3>{property.name}</h3>
        <div className="status-emoji">{getStatusEmoji()}</div>
      </div>

      {/* Revenue - always show weekly earnings */}
      <div className="revenue-section">
        <div className="revenue-amount">💰 ${property.weeklyRevenue.toLocaleString()} this week</div>
      </div>

      {/* Status items - visual representation of everything */}
      <div className="status-items">
        {getCleaningStatus()}
        {getGuestStatus()}
        {getNextGuestStatus()}
      </div>

      {/* Action area - only show when action needed */}
      <div className="action-area">
        {property.unhandledMessages > 0 ? (
          <button className="help-button" onClick={onHelpGuest}>
            HELP GUEST 🤝
          </button>
        ) : property.status === 'good' ? (
          <div className="all-good-indicator">
            😊 ALL GOOD
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PropFlowMVP;