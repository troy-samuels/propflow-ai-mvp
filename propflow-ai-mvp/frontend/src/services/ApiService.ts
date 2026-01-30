/**
 * API Service Layer
 * Handles all backend communication with error handling and retry logic
 */

import { Property, Cleaner, CleaningJob, Booking } from '../models';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiService {
  private baseUrl: string;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
        ...options.headers,
      },
      ...options,
    };

    let lastError: Error;

    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, defaultOptions);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.message || `HTTP ${response.status}`,
            response.status,
            errorData.errors
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < this.retryAttempts - 1) {
          await this.delay(this.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError!;
  }

  private getAuthToken(): string {
    // In production, get from secure storage
    return localStorage.getItem('auth_token') || '';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Property Management APIs
  async getProperties(hostId: string): Promise<Property[]> {
    const response = await this.makeRequest<Property[]>(`/hosts/${hostId}/properties`);
    return response.data;
  }

  async getProperty(propertyId: string): Promise<Property> {
    const response = await this.makeRequest<Property>(`/properties/${propertyId}`);
    return response.data;
  }

  async createProperty(property: Partial<Property>): Promise<Property> {
    const response = await this.makeRequest<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(property),
    });
    return response.data;
  }

  async updateProperty(propertyId: string, updates: Partial<Property>): Promise<Property> {
    const response = await this.makeRequest<Property>(`/properties/${propertyId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  // Cleaner Management APIs
  async getAvailableCleaners(
    location: { lat: number; lng: number },
    datetime: Date,
    radiusMiles: number = 20
  ): Promise<Cleaner[]> {
    const params = new URLSearchParams({
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      datetime: datetime.toISOString(),
      radius: radiusMiles.toString(),
    });

    const response = await this.makeRequest<Cleaner[]>(`/cleaners/available?${params}`);
    return response.data;
  }

  async getCleaner(cleanerId: string): Promise<Cleaner> {
    const response = await this.makeRequest<Cleaner>(`/cleaners/${cleanerId}`);
    return response.data;
  }

  async updateCleanerAvailability(
    cleanerId: string,
    availability: any
  ): Promise<void> {
    await this.makeRequest(`/cleaners/${cleanerId}/availability`, {
      method: 'PUT',
      body: JSON.stringify(availability),
    });
  }

  // Cleaning Job Management APIs
  async getCleaningJobs(
    propertyId?: string,
    status?: string,
    limit?: number
  ): Promise<CleaningJob[]> {
    const params = new URLSearchParams();
    if (propertyId) params.append('propertyId', propertyId);
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit.toString());

    const response = await this.makeRequest<CleaningJob[]>(`/cleaning-jobs?${params}`);
    return response.data;
  }

  async createCleaningJob(job: Partial<CleaningJob>): Promise<CleaningJob> {
    const response = await this.makeRequest<CleaningJob>('/cleaning-jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
    return response.data;
  }

  async assignCleaner(jobId: string, cleanerId: string): Promise<CleaningJob> {
    const response = await this.makeRequest<CleaningJob>(`/cleaning-jobs/${jobId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ cleanerId }),
    });
    return response.data;
  }

  async updateJobStatus(jobId: string, status: string, notes?: string): Promise<CleaningJob> {
    const response = await this.makeRequest<CleaningJob>(`/cleaning-jobs/${jobId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
    return response.data;
  }

  async uploadCleaningPhotos(jobId: string, photos: File[]): Promise<string[]> {
    const formData = new FormData();
    photos.forEach((photo, index) => {
      formData.append(`photo_${index}`, photo);
    });

    const response = await fetch(`${this.baseUrl}/cleaning-jobs/${jobId}/photos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError(`Failed to upload photos`, response.status);
    }

    const data = await response.json();
    return data.data.photoUrls;
  }

  // Pricing Intelligence APIs
  async getPriceRecommendation(
    propertyId: string,
    dates: { start: Date; end: Date }
  ): Promise<any> {
    const response = await this.makeRequest<any>(`/pricing/recommendations`, {
      method: 'POST',
      body: JSON.stringify({
        propertyId,
        startDate: dates.start.toISOString(),
        endDate: dates.end.toISOString(),
      }),
    });
    return response.data;
  }

  async applyPriceOptimization(
    propertyId: string,
    pricing: { dates: Date[]; price: number }
  ): Promise<void> {
    await this.makeRequest(`/pricing/apply`, {
      method: 'POST',
      body: JSON.stringify({
        propertyId,
        pricing,
      }),
    });
  }

  async getMarketData(location: { lat: number; lng: number }): Promise<any> {
    const params = new URLSearchParams({
      lat: location.lat.toString(),
      lng: location.lng.toString(),
    });

    const response = await this.makeRequest<any>(`/market-data?${params}`);
    return response.data;
  }

  // Guest Communication APIs
  async getGuestMessages(
    propertyId?: string,
    bookingId?: string,
    unreadOnly?: boolean
  ): Promise<any[]> {
    const params = new URLSearchParams();
    if (propertyId) params.append('propertyId', propertyId);
    if (bookingId) params.append('bookingId', bookingId);
    if (unreadOnly) params.append('unreadOnly', 'true');

    const response = await this.makeRequest<any[]>(`/guest-messages?${params}`);
    return response.data;
  }

  async sendGuestMessage(
    bookingId: string,
    message: string,
    automated: boolean = false
  ): Promise<any> {
    const response = await this.makeRequest<any>(`/guest-messages`, {
      method: 'POST',
      body: JSON.stringify({
        bookingId,
        message,
        automated,
      }),
    });
    return response.data;
  }

  async generateAutoResponse(messageId: string): Promise<string> {
    const response = await this.makeRequest<{ response: string }>(`/guest-messages/${messageId}/auto-response`);
    return response.data.response;
  }

  // Property Monitoring APIs
  async getPropertyAlerts(propertyId?: string, severity?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (propertyId) params.append('propertyId', propertyId);
    if (severity) params.append('severity', severity);

    const response = await this.makeRequest<any[]>(`/property-alerts?${params}`);
    return response.data;
  }

  async resolveAlert(alertId: string, resolution: any): Promise<void> {
    await this.makeRequest(`/property-alerts/${alertId}/resolve`, {
      method: 'POST',
      body: JSON.stringify(resolution),
    });
  }

  // Booking Management APIs
  async getBookings(
    propertyId?: string,
    status?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (propertyId) params.append('propertyId', propertyId);
    if (status) params.append('status', status);
    if (dateRange) {
      params.append('startDate', dateRange.start.toISOString());
      params.append('endDate', dateRange.end.toISOString());
    }

    const response = await this.makeRequest<Booking[]>(`/bookings?${params}`);
    return response.data;
  }

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking> {
    const response = await this.makeRequest<Booking>(`/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  // Analytics APIs
  async getPropertyMetrics(
    propertyId: string,
    timeframe: 'week' | 'month' | 'quarter' | 'year'
  ): Promise<any> {
    const response = await this.makeRequest<any>(`/analytics/properties/${propertyId}/metrics?timeframe=${timeframe}`);
    return response.data;
  }

  async getPortfolioMetrics(
    hostId: string,
    timeframe: 'week' | 'month' | 'quarter' | 'year'
  ): Promise<any> {
    const response = await this.makeRequest<any>(`/analytics/hosts/${hostId}/metrics?timeframe=${timeframe}`);
    return response.data;
  }

  // Revenue Optimization APIs
  async getRevenueOpportunities(propertyIds?: string[]): Promise<any[]> {
    const body = propertyIds ? { propertyIds } : {};
    const response = await this.makeRequest<any[]>('/revenue-opportunities', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return response.data;
  }

  async applyRevenueOptimization(opportunityId: string): Promise<void> {
    await this.makeRequest(`/revenue-opportunities/${opportunityId}/apply`, {
      method: 'POST',
    });
  }

  // Real-time Events
  setupWebSocketConnection(hostId: string): WebSocket {
    const wsUrl = `${this.baseUrl.replace('http', 'ws')}/ws/${hostId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.reason);
      // Implement reconnection logic here
      setTimeout(() => {
        this.setupWebSocketConnection(hostId);
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return ws;
  }
}

// Singleton instance
export const apiService = new ApiService(
  process.env.REACT_APP_API_URL || '/api'
);