// Next.js API Route: /api/calculator-leads (Resend Version)
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../lib/email/send';
import { createCalculatorWelcomeEmail } from '../lib/email/templates';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName, inputs, results } = req.body;

    // Validate required fields
    if (!email || !firstName || !inputs || !results) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate key metrics for storage
    const leadData = {
      email,
      first_name: firstName,
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
      ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      referrer: req.headers.referer,
      utm_source: req.query.utm_source || null,
      utm_medium: req.query.utm_medium || null,
      utm_campaign: req.query.utm_campaign || null
    };

    // Store in database
    const { data: lead, error: dbError } = await supabase
      .from('calculator_leads')
      .insert([leadData])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to save lead data' });
    }

    // Send welcome email with personalized report
    const emailResult = await sendWelcomeEmail(leadData, results);
    
    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);
      // Don't fail the request if email fails - lead is still captured
    }

    // Add to email marketing sequence
    await addToEmailSequence(leadData);

    // Track conversion event
    await trackConversionEvent(leadData);

    return res.status(200).json({ 
      success: true,
      leadId: lead.id,
      emailSent: emailResult.success,
      emailSuppressed: emailResult.suppressed?.length > 0,
      message: emailResult.success ? 'Analysis sent to your email!' : 'Analysis saved! Email delivery pending.'
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function sendWelcomeEmail(leadData, results) {
  const { email, first_name, platform, annual_platform_cost, annual_savings_potential } = leadData;

  // Generate personalized recommendations
  const recommendations = generatePersonalizedRecommendations(leadData, results);

  // Create email template data
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
    
    // CTAs
    trial_url: `${process.env.NEXT_PUBLIC_TRIAL_URL || 'https://tutorlingua.com/trial'}?source=calculator&email=${encodeURIComponent(email)}`,
    consultation_url: `https://calendly.com/tutorlingua/independence-consultation?prefill_email=${encodeURIComponent(email)}`,
    
    // Personalized recommendations
    recommendations
  };

  // Generate HTML and text content
  const { html, text } = createCalculatorWelcomeEmail(templateData);

  // Send email using your Resend infrastructure
  const emailResult = await sendEmail({
    to: email,
    subject: `${first_name}, you could save ${templateData.annual_savings} annually 💰`,
    html,
    text,
    category: 'calculator-welcome',
    tags: [
      { name: 'source', value: 'calculator' },
      { name: 'platform', value: platform },
      { name: 'savings_tier', value: getSavingsTier(annual_savings_potential) }
    ],
    metadata: {
      calculatorType: 'independence-calculator',
      platform: platform,
      annualSavings: annual_savings_potential,
      leadId: email // Will be updated with actual lead ID if needed
    },
    idempotencyKey: `calculator-welcome-${email}-${Date.now()}`
  });

  return emailResult;
}

async function addToEmailSequence(leadData) {
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
        metadata: {
          source: 'calculator',
          platform: leadData.platform,
          annual_savings: leadData.annual_savings_potential,
          hours_per_week: leadData.hours_per_week,
          hourly_rate: leadData.hourly_rate,
          experience: leadData.experience_level
        }
      });
  } catch (error) {
    console.error('Sequence enrollment error:', error);
  }
}

async function trackConversionEvent(leadData) {
  // Track in analytics platforms
  const eventData = {
    event: 'calculator_email_capture',
    user_id: leadData.email,
    properties: {
      platform: leadData.platform,
      annual_cost: leadData.annual_platform_cost,
      savings_potential: leadData.annual_savings_potential,
      hours_per_week: leadData.hours_per_week,
      hourly_rate: leadData.hourly_rate,
      experience: leadData.experience_level,
      savings_tier: getSavingsTier(leadData.annual_savings_potential)
    }
  };

  try {
    // Google Analytics 4 Measurement Protocol
    if (process.env.GA4_MEASUREMENT_ID && process.env.GA4_API_SECRET) {
      await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: leadData.email,
          events: [{
            name: 'calculator_conversion',
            parameters: {
              platform: leadData.platform,
              annual_savings: leadData.annual_savings_potential,
              user_type: leadData.experience_level,
              value: Math.min(leadData.annual_savings_potential / 100, 1000), // Cap value for GA
              currency: 'USD'
            }
          }]
        })
      });
    }

    // Facebook Pixel (if configured)
    if (process.env.FACEBOOK_PIXEL_ID && process.env.FACEBOOK_PIXEL_ACCESS_TOKEN) {
      await fetch(`https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PIXEL_ID}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: process.env.FACEBOOK_PIXEL_ACCESS_TOKEN,
          data: [{
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            user_data: {
              em: [hashEmail(leadData.email)]
            },
            custom_data: {
              content_category: 'calculator',
              value: Math.min(leadData.annual_savings_potential / 100, 1000),
              currency: 'USD'
            }
          }]
        })
      });
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

function generatePersonalizedRecommendations(leadData, results) {
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

function getSavingsTier(annualSavings) {
  if (annualSavings >= 15000) return 'high';
  if (annualSavings >= 7500) return 'medium';
  if (annualSavings >= 3000) return 'low';
  return 'minimal';
}

function hashEmail(email) {
  // Simple hash for Facebook Pixel (in production, use proper crypto hashing)
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
}

// Database schema additions for email sequence tracking:
/*
CREATE TABLE email_sequence_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL,
  sequence_type VARCHAR NOT NULL,
  tags TEXT[] DEFAULT '{}',
  enrolled_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_sequence_enrollments_email ON email_sequence_enrollments(email);
CREATE INDEX idx_sequence_enrollments_type ON email_sequence_enrollments(sequence_type);
CREATE INDEX idx_sequence_enrollments_active ON email_sequence_enrollments(active);
*/