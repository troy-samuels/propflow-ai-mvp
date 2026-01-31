// Next.js API Route: /api/calculator-leads (Secure Version)
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../../lib/email/send';
import { createCalculatorWelcomeEmail } from '../../lib/email/templates';
import { validateCalculatorInput } from '../../lib/validation';
import { getRequiredEnvVar, hashPII, generateRequestId, checkRateLimit } from '../../lib/security';

// Initialize Supabase with safe environment variables
const supabaseUrl = getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getRequiredEnvVar('SUPABASE_SERVICE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

// CSRF Protection Headers
const CSRF_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestId = generateRequestId();
  const startTime = Date.now();
  
  try {
    console.log(`[${requestId}] API request started`);
    
    // Add security headers
    Object.entries(CSRF_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    // Method validation
    if (req.method !== 'POST') {
      console.warn(`[${requestId}] Invalid method: ${req.method}`);
      return res.status(405).json({ 
        error: 'Method not allowed',
        allowedMethods: ['POST']
      });
    }
    
    // Rate limiting
    const clientIp = (req.headers['x-forwarded-for'] as string) || 
                    (req.connection.remoteAddress as string) || 
                    'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    const rateLimitResult = checkRateLimit(`${clientIp}:${userAgent}`, 5, 15 * 60 * 1000);
    
    if (!rateLimitResult.success) {
      console.warn(`[${requestId}] Rate limit exceeded for IP: ${clientIp}`);
      
      res.setHeader('Retry-After', Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000));
      res.setHeader('X-RateLimit-Limit', rateLimitResult.limit);
      res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
      res.setHeader('X-RateLimit-Reset', rateLimitResult.reset.toISOString());
      
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfter: rateLimitResult.reset
      });
    }
    
    // Set rate limit headers for successful requests
    res.setHeader('X-RateLimit-Limit', rateLimitResult.limit);
    res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
    res.setHeader('X-RateLimit-Reset', rateLimitResult.reset.toISOString());
    
    // Input validation
    let validatedData;
    try {
      validatedData = validateCalculatorInput(req.body);
      console.log(`[${requestId}] Input validation passed`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid input data';
      console.warn(`[${requestId}] Input validation failed: ${errorMessage}`);
      
      return res.status(400).json({
        error: 'Invalid input data',
        details: errorMessage
      });
    }
    
    const { email, firstName, inputs, results } = validatedData;
    
    // Calculate key metrics for storage
    const leadData = {
      email: email.toLowerCase().trim(),
      first_name: firstName.trim(),
      hours_per_week: inputs.hoursPerWeek,
      hourly_rate: inputs.hourlyRate,
      platform: inputs.platform,
      experience_level: inputs.experience,
      currency: inputs.currency,
      annual_platform_cost: Math.round(results.platform.annualCommission),
      annual_savings_potential: Math.round(results.comparison.annualDifference),
      percentage_increase: Math.round(results.comparison.percentageIncrease),
      monthly_difference: Math.round(results.comparison.monthlyDifference),
      created_at: new Date().toISOString(),
      request_id: requestId,
      ip_address: clientIp,
      user_agent: userAgent.substring(0, 500), // Truncate to prevent overflow
      referrer: (req.headers.referer || '').substring(0, 500),
      utm_source: typeof req.query.utm_source === 'string' ? req.query.utm_source.substring(0, 100) : null,
      utm_medium: typeof req.query.utm_medium === 'string' ? req.query.utm_medium.substring(0, 100) : null,
      utm_campaign: typeof req.query.utm_campaign === 'string' ? req.query.utm_campaign.substring(0, 100) : null
    };
    
    console.log(`[${requestId}] Saving lead data for email: ${email}`);
    
    // Store in database with error handling
    const { data: lead, error: dbError } = await supabase
      .from('calculator_leads')
      .insert([leadData])
      .select()
      .single();
    
    if (dbError) {
      console.error(`[${requestId}] Database error:`, dbError);
      
      // Check for duplicate email constraint
      if (dbError.code === '23505') {
        return res.status(409).json({
          error: 'Email already exists',
          message: 'You have already submitted this email address.'
        });
      }
      
      return res.status(500).json({
        error: 'Failed to save lead data',
        message: 'Please try again later.'
      });
    }
    
    console.log(`[${requestId}] Lead saved with ID: ${lead.id}`);
    
    // Send welcome email with error handling
    let emailResult;
    try {
      emailResult = await sendWelcomeEmail(leadData, results, requestId);
      console.log(`[${requestId}] Email send result: ${emailResult.success ? 'success' : 'failed'}`);
    } catch (error) {
      console.error(`[${requestId}] Email sending failed:`, error);
      emailResult = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
    
    // Add to email marketing sequence (non-blocking)
    addToEmailSequence(leadData, requestId).catch(error => {
      console.error(`[${requestId}] Email sequence enrollment failed:`, error);
    });
    
    // Track conversion event (non-blocking)
    trackConversionEvent(leadData, requestId).catch(error => {
      console.error(`[${requestId}] Analytics tracking failed:`, error);
    });
    
    const processingTime = Date.now() - startTime;
    console.log(`[${requestId}] Request completed in ${processingTime}ms`);
    
    return res.status(200).json({
      success: true,
      leadId: lead.id,
      emailSent: emailResult.success,
      emailSuppressed: emailResult.suppressed ? emailResult.suppressed.length > 0 : false,
      message: emailResult.success 
        ? 'Analysis sent to your email!' 
        : 'Analysis saved! Email delivery pending.',
      processingTime
    });
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[${requestId}] Unexpected API error:`, error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Please try again later.',
      requestId,
      processingTime
    });
  }
}

async function sendWelcomeEmail(leadData: any, results: any, requestId: string) {
  console.log(`[${requestId}] Preparing welcome email`);
  
  const { email, first_name, platform, annual_platform_cost, annual_savings_potential } = leadData;
  
  // Generate personalized recommendations
  const recommendations = generatePersonalizedRecommendations(leadData, results);
  
  // Create email template data with safe URL construction
  const baseUrl = getRequiredEnvVar('NEXT_PUBLIC_BASE_URL');
  const trialUrl = `${getRequiredEnvVar('NEXT_PUBLIC_TRIAL_URL')}?source=calculator&email=${encodeURIComponent(email)}&utm_campaign=calculator_welcome`;
  const consultationUrl = `https://calendly.com/tutorlingua/independence-consultation?prefill_email=${encodeURIComponent(email)}`;
  
  const templateData = {
    first_name,
    platform_name: platform.charAt(0).toUpperCase() + platform.slice(1),
    annual_platform_cost: `$${annual_platform_cost.toLocaleString()}`,
    annual_savings: `$${annual_savings_potential.toLocaleString()}`,
    monthly_difference: `$${Math.round(annual_savings_potential / 12).toLocaleString()}`,
    percentage_increase: Math.round((annual_savings_potential / (results.platform.annualNet)) * 100),
    
    // 5-year projections
    five_year_platform_cost: `$${(annual_platform_cost * 5).toLocaleString()}`,
    five_year_savings: `$${(annual_savings_potential * 5).toLocaleString()}`,
    
    // Action items
    suggested_hourly_rate: `$${Math.round(leadData.hourly_rate * 1.15)}`,
    break_even_months: Math.ceil(468 / (annual_savings_potential / 12)), // TutorLingua annual cost / monthly savings
    
    // CTAs with proper URL encoding
    trial_url: trialUrl,
    consultation_url: consultationUrl,
    
    // Personalized recommendations
    recommendations
  };
  
  // Generate HTML and text content
  const { html, text } = createCalculatorWelcomeEmail(templateData);
  
  // Send email using secure infrastructure
  const emailResult = await sendEmail({
    to: email,
    subject: `${first_name}, you could save ${templateData.annual_savings} annually 💰`,
    html,
    text,
    category: 'calculator-welcome',
    tags: [
      { name: 'source', value: 'calculator' },
      { name: 'platform', value: platform },
      { name: 'savings_tier', value: getSavingsTier(annual_savings_potential) },
      { name: 'request_id', value: requestId }
    ],
    metadata: {
      calculatorType: 'independence-calculator',
      platform: platform,
      annualSavings: annual_savings_potential,
      leadId: leadData.email,
      requestId
    },
    idempotencyKey: `calculator-welcome-${hashPII(email)}-${Date.now()}`
  });
  
  return emailResult;
}

async function addToEmailSequence(leadData: any, requestId: string) {
  console.log(`[${requestId}] Adding to email sequence`);
  
  // Tag-based email sequence enrollment
  const sequenceTags = [
    'calculator-lead',
    `platform-${leadData.platform}`,
    `savings-${getSavingsTier(leadData.annual_savings_potential)}`,
    `experience-${leadData.experience_level}`,
    'independence-sequence'
  ];
  
  // Store sequence enrollment in database for tracking
  try {
    await supabase
      .from('email_sequence_enrollments')
      .insert({
        email: leadData.email,
        sequence_type: 'calculator-independence',
        tags: sequenceTags,
        enrolled_at: new Date().toISOString(),
        request_id: requestId,
        metadata: {
          source: 'calculator',
          platform: leadData.platform,
          annual_savings: leadData.annual_savings_potential,
          hours_per_week: leadData.hours_per_week,
          hourly_rate: leadData.hourly_rate,
          experience: leadData.experience_level
        }
      });
    
    console.log(`[${requestId}] Email sequence enrollment successful`);
  } catch (error) {
    console.error(`[${requestId}] Sequence enrollment error:`, error);
    throw error;
  }
}

async function trackConversionEvent(leadData: any, requestId: string) {
  console.log(`[${requestId}] Tracking conversion event`);
  
  // Hash PII for analytics compliance
  const hashedEmail = hashPII(leadData.email);
  
  const eventData = {
    event: 'calculator_email_capture',
    user_id: hashedEmail, // Use hashed email
    properties: {
      platform: leadData.platform,
      annual_cost: leadData.annual_platform_cost,
      savings_potential: leadData.annual_savings_potential,
      hours_per_week: leadData.hours_per_week,
      hourly_rate: leadData.hourly_rate,
      experience: leadData.experience_level,
      savings_tier: getSavingsTier(leadData.annual_savings_potential),
      request_id: requestId
    }
  };
  
  const promises = [];
  
  try {
    // Google Analytics 4 Measurement Protocol (with hashed PII)
    const ga4MeasurementId = process.env.GA4_MEASUREMENT_ID;
    const ga4ApiSecret = process.env.GA4_API_SECRET;
    
    if (ga4MeasurementId && ga4ApiSecret) {
      promises.push(
        fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${ga4MeasurementId}&api_secret=${ga4ApiSecret}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: hashedEmail, // Use hashed email
            events: [{
              name: 'calculator_conversion',
              parameters: {
                platform: leadData.platform,
                annual_savings: leadData.annual_savings_potential,
                user_type: leadData.experience_level,
                value: Math.min(leadData.annual_savings_potential / 100, 1000), // Cap value for GA
                currency: 'USD',
                request_id: requestId
              }
            }]
          })
        })
      );
    }
    
    // Facebook Pixel (already using hashed email)
    const facebookPixelId = process.env.FACEBOOK_PIXEL_ID;
    const facebookPixelToken = process.env.FACEBOOK_PIXEL_ACCESS_TOKEN;
    
    if (facebookPixelId && facebookPixelToken) {
      promises.push(
        fetch(`https://graph.facebook.com/v18.0/${facebookPixelId}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: facebookPixelToken,
            data: [{
              event_name: 'Lead',
              event_time: Math.floor(Date.now() / 1000),
              user_data: {
                em: [hashedEmail] // Use consistently hashed email
              },
              custom_data: {
                content_category: 'calculator',
                value: Math.min(leadData.annual_savings_potential / 100, 1000),
                currency: 'USD',
                request_id: requestId
              }
            }]
          })
        })
      );
    }
    
    // Wait for all analytics calls to complete
    await Promise.allSettled(promises);
    console.log(`[${requestId}] Analytics tracking completed`);
    
  } catch (error) {
    console.error(`[${requestId}] Analytics tracking error:`, error);
    throw error;
  }
}

function generatePersonalizedRecommendations(leadData: any, results: any) {
  const recommendations = [];
  
  // Platform-specific recommendations
  switch (leadData.platform) {
    case 'preply':
      recommendations.push({
        title: "Preply Commission Strategy",
        description: `You're paying ${leadData.experience_level === 'new' ? '33%' : '18%'} commission to Preply. Even experienced tutors lose significant income to fees.`,
        action: "Consider gradual transition to direct booking to keep 100% of earnings."
      });
      break;
    case 'italki':
      recommendations.push({
        title: "iTalki Fee Analysis",
        description: "iTalki's 15% commission plus payment processing fees add up to nearly 18% total cost.",
        action: "Your professional experience qualifies you for premium independent rates."
      });
      break;
    case 'cambly':
      recommendations.push({
        title: "Cambly Rate Limitations",
        description: "Cambly's fixed $10.20/hour severely limits your earning potential.",
        action: "Independent tutors in your market typically charge 3-4x more for similar lessons."
      });
      break;
  }
  
  // Hours-based recommendations
  if (leadData.hours_per_week >= 30) {
    recommendations.push({
      title: "High-Volume Teacher Benefits",
      description: `At ${leadData.hours_per_week} hours/week, you're a professional tutor. Independence offers maximum benefit for full-time teachers.`,
      action: "Consider immediate transition planning - your volume justifies the business investment."
    });
  } else if (leadData.hours_per_week <= 10) {
    recommendations.push({
      title: "Part-Time Teacher Strategy",
      description: "Even part-time tutors benefit from independence, especially with high hourly rates.",
      action: "Start with direct booking for premium students while keeping platform for discovery."
    });
  }
  
  // Rate-based recommendations
  if (leadData.hourly_rate >= 40) {
    recommendations.push({
      title: "Premium Rate Optimization",
      description: `Your $${leadData.hourly_rate}/hour rate suggests premium positioning. Independent tutors can charge 15-25% more.`,
      action: `Consider increasing to $${Math.round(leadData.hourly_rate * 1.2)}/hour for direct bookings.`
    });
  } else if (leadData.hourly_rate <= 15) {
    recommendations.push({
      title: "Rate Improvement Opportunity",
      description: `Your current $${leadData.hourly_rate}/hour rate has significant upside potential.`,
      action: "Independent tutors with your experience typically charge $25-40/hour."
    });
  }
  
  // Savings-based recommendations
  if (leadData.annual_savings_potential >= 10000) {
    recommendations.push({
      title: "High-Impact Independence",
      description: `Your potential $${leadData.annual_savings_potential.toLocaleString()} annual savings justify immediate action.`,
      action: "Schedule independence consultation - your ROI timeline is excellent."
    });
  }
  
  // Experience-based recommendations
  if (leadData.experience_level === 'expert') {
    recommendations.push({
      title: "Expert Teacher Advantage",
      description: "Your expertise commands premium rates that platforms cap artificially.",
      action: "Expert independent tutors often charge 50-100% more than platform rates."
    });
  }
  
  return recommendations.slice(0, 4); // Limit to top 4 recommendations
}

function getSavingsTier(annualSavings: number): string {
  if (annualSavings >= 15000) return 'high';
  if (annualSavings >= 7500) return 'medium';
  if (annualSavings >= 3000) return 'low';
  return 'minimal';
}