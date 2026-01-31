import DOMPurify from 'isomorphic-dompurify';
import CryptoJS from 'crypto-js';

/**
 * HTML sanitization and XSS protection
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize HTML content for safe email templates
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'div', 'span'],
    ALLOWED_ATTR: ['style'],
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onclick', 'onerror', 'onload', 'href', 'src']
  });
}

/**
 * Hash sensitive data for analytics (GDPR compliant)
 */
export function hashPII(data: string): string {
  if (typeof data !== 'string') {
    return '';
  }
  
  return CryptoJS.SHA256(data.toLowerCase().trim()).toString(CryptoJS.enc.Hex);
}

/**
 * Generate request ID for tracking
 */
export function generateRequestId(): string {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
}

/**
 * Validate environment variables safely
 */
export function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getOptionalEnvVar(name: string, defaultValue: string = ''): string {
  return process.env[name] || defaultValue;
}

/**
 * Safe JSON parsing
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
}

/**
 * Rate limiting helper
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

const rateLimitStore = new Map<string, { count: number; reset: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.reset < now) {
      rateLimitStore.delete(key);
    }
  }
  
  const current = rateLimitStore.get(identifier);
  
  if (!current || current.reset < now) {
    // New window
    rateLimitStore.set(identifier, {
      count: 1,
      reset: now + windowMs
    });
    
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: new Date(now + windowMs)
    };
  }
  
  if (current.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: new Date(current.reset)
    };
  }
  
  current.count++;
  rateLimitStore.set(identifier, current);
  
  return {
    success: true,
    limit,
    remaining: limit - current.count,
    reset: new Date(current.reset)
  };
}