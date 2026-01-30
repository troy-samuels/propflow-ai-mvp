/**
 * Unified Command Center Dashboard
 * Frictionless interface connecting all PropFlow AI features
 */

import React, { useState, useEffect } from 'react';
import { PropertyCard } from './PropertyCard';
import { ContextualAlert } from './ContextualAlert';
import { QuickActions } from './QuickActions';
import { RevenueInsights } from './RevenueInsights';
import { useRealTimeEvents } from '../hooks/useRealTimeEvents';
import { usePropertyData } from '../hooks/usePropertyData';

interface UnifiedDashboardProps {
  hostId: string;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({ hostId }) => {
  const { properties, loading } = usePropertyData(hostId);
  const { alerts, opportunities, cleaningJobs } = useRealTimeEvents(hostId);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="dashboard-container">
      {/* Header with global stats */}
      <DashboardHeader 
        totalRevenue={properties.reduce((sum, p) => sum + p.weeklyRevenue, 0)}
        activeAlerts={alerts.filter(a => a.severity === 'high').length}
        propertiesCount={properties.length}
      />

      {/* Critical alerts that need immediate attention */}
      <AlertSection alerts={alerts.filter(a => a.severity === 'critical')} />

      {/* Revenue opportunities - contextual and time-sensitive */}
      <OpportunitySection opportunities={opportunities} />

      {/* Property grid with contextual overlays */}
      <div className="properties-grid">
        {properties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            alerts={alerts.filter(a => a.propertyId === property.id)}
            opportunities={opportunities.filter(o => o.propertyId === property.id)}
            cleaningJobs={cleaningJobs.filter(j => j.propertyId === property.id)}
            onSelect={() => setSelectedProperty(property.id)}
            selected={selectedProperty === property.id}
          />
        ))}
      </div>

      {/* Floating quick actions */}
      <QuickActions 
        onAddProperty={() => {/* Handle add property */}}
        onEmergencyContact={() => {/* Handle emergency */}}
        onBulkUpdate={() => {/* Handle bulk operations */}}
      />

      {/* Property detail panel (slides in when property selected) */}
      {selectedProperty && (
        <PropertyDetailPanel
          propertyId={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

const DashboardHeader: React.FC<{
  totalRevenue: number;
  activeAlerts: number;
  propertiesCount: number;
}> = ({ totalRevenue, activeAlerts, propertiesCount }) => (
  <div className="dashboard-header">
    <div className="header-content">
      <h1>PropFlow AI Command Center</h1>
      <div className="global-stats">
        <div className="stat-card revenue">
          <span className="stat-value">${totalRevenue.toLocaleString()}</span>
          <span className="stat-label">Last 7 Days</span>
        </div>
        <div className="stat-card properties">
          <span className="stat-value">{propertiesCount}</span>
          <span className="stat-label">Properties</span>
        </div>
        <div className={`stat-card alerts ${activeAlerts > 0 ? 'has-alerts' : ''}`}>
          <span className="stat-value">{activeAlerts}</span>
          <span className="stat-label">Active Alerts</span>
        </div>
      </div>
    </div>
    <div className="system-status">
      <span className="status-indicator online">🟢</span>
      <span>All Systems Operational</span>
    </div>
  </div>
);

const AlertSection: React.FC<{ alerts: any[] }> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="alert-section critical">
      <h2>🚨 Needs Immediate Attention</h2>
      <div className="alerts-grid">
        {alerts.map(alert => (
          <ContextualAlert
            key={alert.id}
            alert={alert}
            onResolve={(alertId) => {/* Handle resolution */}}
            onEscalate={(alertId) => {/* Handle escalation */}}
          />
        ))}
      </div>
    </div>
  );
};

const OpportunitySection: React.FC<{ opportunities: any[] }> = ({ opportunities }) => {
  if (opportunities.length === 0) return null;

  return (
    <div className="opportunity-section">
      <h2>💰 Revenue Opportunities</h2>
      <div className="opportunities-grid">
        {opportunities.map(opp => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            onApply={(oppId) => {/* Auto-apply optimization */}}
            onDismiss={(oppId) => {/* Dismiss opportunity */}}
          />
        ))}
      </div>
    </div>
  );
};

const OpportunityCard: React.FC<{
  opportunity: any;
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
}> = ({ opportunity, onApply, onDismiss }) => (
  <div className="opportunity-card">
    <div className="opportunity-header">
      <span className="opportunity-type">{opportunity.type}</span>
      <span className="opportunity-impact">+${opportunity.potentialRevenue}</span>
    </div>
    <div className="opportunity-content">
      <h3>{opportunity.title}</h3>
      <p>{opportunity.description}</p>
      <div className="opportunity-details">
        <span>Confidence: {(opportunity.confidence * 100).toFixed(0)}%</span>
        <span>Valid until: {opportunity.expiresAt}</span>
      </div>
    </div>
    <div className="opportunity-actions">
      <button 
        className="btn-apply"
        onClick={() => onApply(opportunity.id)}
      >
        Apply Automatically
      </button>
      <button 
        className="btn-dismiss"
        onClick={() => onDismiss(opportunity.id)}
      >
        Dismiss
      </button>
    </div>
  </div>
);

const PropertyDetailPanel: React.FC<{
  propertyId: string;
  onClose: () => void;
}> = ({ propertyId, onClose }) => {
  const { property, loading } = usePropertyDetail(propertyId);

  if (loading) return <div className="detail-panel loading">Loading...</div>;

  return (
    <div className="property-detail-panel">
      <div className="panel-header">
        <h2>{property.name}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="panel-content">
        {/* Real-time status */}
        <div className="status-section">
          <div className="current-status">
            <span className={`status-badge ${property.status}`}>
              {property.status.replace('_', ' ').toUpperCase()}
            </span>
            {property.nextEvent && (
              <span className="next-event">
                Next: {property.nextEvent.type} at {property.nextEvent.time}
              </span>
            )}
          </div>
        </div>

        {/* Tabbed interface for different aspects */}
        <PropertyDetailTabs property={property} />
      </div>
    </div>
  );
};

const PropertyDetailTabs: React.FC<{ property: any }> = ({ property }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'cleaning', label: 'Cleaning', icon: '🧹' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'guests', label: 'Guests', icon: '👥' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
  ];

  return (
    <div className="detail-tabs">
      <div className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        {activeTab === 'overview' && <OverviewTab property={property} />}
        {activeTab === 'calendar' && <CalendarTab property={property} />}
        {activeTab === 'cleaning' && <CleaningTab property={property} />}
        {activeTab === 'pricing' && <PricingTab property={property} />}
        {activeTab === 'guests' && <GuestsTab property={property} />}
        {activeTab === 'maintenance' && <MaintenanceTab property={property} />}
      </div>
    </div>
  );
};

const OverviewTab: React.FC<{ property: any }> = ({ property }) => (
  <div className="overview-tab">
    <div className="overview-stats">
      <div className="stat-row">
        <div className="stat">
          <label>Occupancy Rate</label>
          <span className="value">{property.occupancyRate}%</span>
        </div>
        <div className="stat">
          <label>Average Daily Rate</label>
          <span className="value">${property.averageDailyRate}</span>
        </div>
        <div className="stat">
          <label>Guest Rating</label>
          <span className="value">{property.guestRating}/5.0</span>
        </div>
      </div>
    </div>
    
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {property.recentActivity?.map((activity: any, index: number) => (
          <div key={index} className="activity-item">
            <span className="activity-time">{activity.time}</span>
            <span className="activity-description">{activity.description}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CleaningTab: React.FC<{ property: any }> = ({ property }) => {
  const { cleaningJobs, loading } = useCleaningJobs(property.id);

  return (
    <div className="cleaning-tab">
      <div className="cleaning-overview">
        <div className="cleaner-status">
          <h3>Current Cleaner</h3>
          {property.assignedCleaner ? (
            <div className="cleaner-card">
              <img src={property.assignedCleaner.photo} alt={property.assignedCleaner.name} />
              <div className="cleaner-info">
                <span className="cleaner-name">{property.assignedCleaner.name}</span>
                <span className="cleaner-rating">⭐ {property.assignedCleaner.rating}/5.0</span>
                <span className="cleaner-status">{property.assignedCleaner.status}</span>
              </div>
            </div>
          ) : (
            <div className="no-cleaner">No cleaner assigned</div>
          )}
        </div>
      </div>

      <div className="cleaning-schedule">
        <h3>Upcoming Cleanings</h3>
        <div className="jobs-list">
          {cleaningJobs.map((job: any) => (
            <div key={job.id} className={`job-card ${job.status}`}>
              <div className="job-header">
                <span className="job-type">{job.type}</span>
                <span className="job-status">{job.status}</span>
              </div>
              <div className="job-details">
                <span className="job-time">
                  {new Date(job.scheduledStart).toLocaleString()}
                </span>
                <span className="job-duration">{job.estimatedDuration} min</span>
              </div>
              {job.assignedCleaner && (
                <div className="job-cleaner">
                  Assigned to: {job.assignedCleaner.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton: React.FC = () => (
  <div className="dashboard-skeleton">
    <div className="skeleton-header"></div>
    <div className="skeleton-grid">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="skeleton-card"></div>
      ))}
    </div>
  </div>
);

// Custom hooks for data fetching
const usePropertyDetail = (propertyId: string) => {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch property details
    setLoading(false);
  }, [propertyId]);

  return { property, loading };
};

const useCleaningJobs = (propertyId: string) => {
  const [cleaningJobs, setCleaningJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch cleaning jobs
    setLoading(false);
  }, [propertyId]);

  return { cleaningJobs, loading };
};

// Placeholder tabs
const CalendarTab: React.FC<{ property: any }> = () => <div>Calendar view coming soon</div>;
const PricingTab: React.FC<{ property: any }> = () => <div>Pricing intelligence coming soon</div>;
const GuestsTab: React.FC<{ property: any }> = () => <div>Guest communication coming soon</div>;
const MaintenanceTab: React.FC<{ property: any }> = () => <div>Maintenance tracking coming soon</div>;