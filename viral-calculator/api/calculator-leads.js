// Next.js API Route: /api/calculator-leads
import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    await sendWelcomeEmail(leadData, results);

    // Add to email sequence
    await addToEmailSequence(leadData);

    // Track conversion event
    await trackConversionEvent(leadData);

    return res.status(200).json({ 
      success: true,
      leadId: lead.id,
      message: 'Analysis sent to your email!'
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function sendWelcomeEmail(leadData, results) {
  const { email, first_name, platform, annual_platform_cost, annual_savings_potential } = leadData;

  const emailTemplate = {
    to: email,
    from: {
      email: 'hello@tutorlingua.com',
      name: 'TutorLingua Independence Calculator'
    },
    templateId: 'd-calculator-welcome-template', // SendGrid template ID
    dynamicTemplateData: {
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
      trial_url: `https://tutorlingua.com/trial?source=calculator&email=${encodeURIComponent(email)}`,
      consultation_url: `https://calendly.com/tutorlingua/independence-consultation?email=${encodeURIComponent(email)}`,
      
      // Personalized recommendations
      recommendations: generatePersonalizedRecommendations(leadData, results)
    }
  };

  try {
    await sgMail.send(emailTemplate);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Email sending error:', error);
  }
}

async function addToEmailSequence(leadData) {
  // Add to email marketing platform (ConvertKit, Mailchimp, etc.)
  const sequenceData = {
    email: leadData.email,
    firstName: leadData.first_name,
    tags: [
      'calculator-lead',
      `platform-${leadData.platform}`,
      `savings-${Math.round(leadData.annual_savings_potential / 1000)}k`,
      'independence-sequence'
    ],
    customFields: {
      'annual_platform_cost': leadData.annual_platform_cost,
      'potential_savings': leadData.annual_savings_potential,
      'hours_per_week': leadData.hours_per_week,
      'hourly_rate': leadData.hourly_rate,
      'experience_level': leadData.experience_level
    }
  };

  // Implementation depends on email platform
  // Example for ConvertKit:
  /*
  try {
    await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.CONVERTKIT_API_KEY,
        email: sequenceData.email,
        first_name: sequenceData.firstName,
        tags: sequenceData.tags,
        fields: sequenceData.customFields
      })
    });
  } catch (error) {
    console.error('Email sequence error:', error);
  }
  */
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
      experience: leadData.experience_level
    }
  };

  // Send to analytics platforms (Mixpanel, Amplitude, Google Analytics, etc.)
  try {
    // Google Analytics 4 Measurement Protocol
    if (process.env.GA4_MEASUREMENT_ID && process.env.GA4_API_SECRET) {
      await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`, {
        method: 'POST',
        body: JSON.stringify({
          client_id: leadData.email, // Use email as client_id
          events: [{
            name: 'calculator_conversion',
            parameters: {
              platform: leadData.platform,
              annual_savings: leadData.annual_savings_potential,
              user_type: leadData.experience_level,
              value: leadData.annual_savings_potential / 100 // Convert to reasonable value
            }
          }]
        })
      });
    }

    // Facebook Pixel
    if (process.env.FACEBOOK_PIXEL_ACCESS_TOKEN) {
      await fetch(`https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PIXEL_ID}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: process.env.FACEBOOK_PIXEL_ACCESS_TOKEN,
          data: [{
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            user_data: {
              em: [leadData.email] // Email hash
            },
            custom_data: {
              content_category: 'calculator',
              value: leadData.annual_savings_potential / 100,
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
  }

  // Savings-based recommendations
  if (leadData.annual_savings_potential >= 10000) {
    recommendations.push({
      title: "High-Impact Independence",
      description: `Your potential ${leadData.annual_savings_potential.toLocaleString()} annual savings justify immediate action.`,
      action: "Schedule independence consultation - your ROI timeline is excellent."
    });
  }

  return recommendations;
}

// Database schema for calculator_leads table:
/*
CREATE TABLE calculator_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  hours_per_week INTEGER NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  platform VARCHAR NOT NULL,
  experience_level VARCHAR NOT NULL,
  currency VARCHAR DEFAULT 'USD',
  annual_platform_cost INTEGER NOT NULL,
  annual_savings_potential INTEGER NOT NULL,
  percentage_increase INTEGER NOT NULL,
  monthly_difference INTEGER NOT NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  utm_source VARCHAR,
  utm_medium VARCHAR,
  utm_campaign VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  email_sent BOOLEAN DEFAULT FALSE,
  trial_started BOOLEAN DEFAULT FALSE,
  converted_to_paid BOOLEAN DEFAULT FALSE,
  consultation_booked BOOLEAN DEFAULT FALSE
);

-- Indexes for performance
CREATE INDEX idx_calculator_leads_email ON calculator_leads(email);
CREATE INDEX idx_calculator_leads_created_at ON calculator_leads(created_at);
CREATE INDEX idx_calculator_leads_platform ON calculator_leads(platform);
CREATE INDEX idx_calculator_leads_savings ON calculator_leads(annual_savings_potential);

-- RLS policies
ALTER TABLE calculator_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage calculator leads"
  ON calculator_leads FOR ALL 
  USING (auth.role() = 'service_role');
*/