# Migration from SendGrid to Resend

## ✅ Completed Migration

The viral calculator has been successfully migrated from SendGrid to Resend with enhanced email infrastructure.

## Key Improvements

### 1. **Better Email Infrastructure**
- ✅ Robust error handling and retry logic
- ✅ Email suppression management (bounces/complaints)
- ✅ Event logging to Supabase for deliverability tracking
- ✅ Idempotency keys to prevent duplicate sends

### 2. **Cleaner Implementation**
- ✅ No template dependencies - everything in code
- ✅ Better type safety with TypeScript interfaces
- ✅ Modular email templates for easy customization
- ✅ Consistent with existing TutorLingua email infrastructure

### 3. **Enhanced Features**
- ✅ Personalized recommendations based on user input
- ✅ Tiered email sequences based on savings potential
- ✅ Advanced analytics tracking (GA4, Facebook Pixel)
- ✅ Email suppression respect for deliverability

## Files Changed

### New Files
```
lib/
├── resend.ts              # Resend client configuration
├── email/
│   ├── types.ts           # Email type definitions
│   ├── send.ts            # Email sending with suppression
│   └── templates.ts       # HTML/text email templates
└── README.md

api/
└── calculator-leads-resend.js  # Updated API endpoint
```

### Updated Files
```
package.json              # Removed @sendgrid/mail, added resend
.env.example             # Updated environment variables
```

## Environment Variables

### Required
```bash
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=calculator@tutorlingua.com
EMAIL_REPLY_TO=hello@tutorlingua.com
```

### Optional (for tracking)
```bash
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_ga4_api_secret
FACEBOOK_PIXEL_ID=your_facebook_pixel_id
FACEBOOK_PIXEL_ACCESS_TOKEN=your_facebook_pixel_token
```

## Database Schema Updates

### New Tables Needed
```sql
-- Email suppression tracking (if not already exists)
CREATE TABLE email_suppressions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  reason VARCHAR, -- bounce, complaint, unsubscribe
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email events logging (if not already exists)
CREATE TABLE email_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id VARCHAR,
  to_email VARCHAR NOT NULL,
  event_type VARCHAR NOT NULL, -- requested, delivered, opened, clicked, bounced, complained
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email sequence enrollment tracking
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
```

## Migration Benefits

### Before (SendGrid)
- ❌ Template dependency
- ❌ Limited error handling
- ❌ No suppression management
- ❌ Basic analytics
- ❌ Single email per lead

### After (Resend)
- ✅ Template-free HTML generation
- ✅ Advanced error handling & retry
- ✅ Automatic suppression respect
- ✅ Multi-platform analytics
- ✅ Sequence-based nurturing

## Usage Example

```javascript
// Before (SendGrid)
await sgMail.send({
  to: email,
  templateId: 'd-calculator-welcome-template',
  dynamicTemplateData: templateData
});

// After (Resend)
const { html, text } = createCalculatorWelcomeEmail(templateData);
const result = await sendEmail({
  to: email,
  subject: `${firstName}, you could save ${savings} annually 💰`,
  html,
  text,
  category: 'calculator-welcome',
  tags: [{ name: 'source', value: 'calculator' }],
  metadata: { calculatorType: 'independence-calculator' }
});
```

## Deployment

1. **Update environment variables** with Resend credentials
2. **Run database migrations** for new tables
3. **Update API endpoint** to use `calculator-leads-resend.js`
4. **Test email delivery** in staging environment
5. **Monitor email events** in Supabase dashboard

## Testing

```bash
# Install new dependencies
npm install

# Test email template generation
node -e "
const { createCalculatorWelcomeEmail } = require('./lib/email/templates');
const result = createCalculatorWelcomeEmail({
  first_name: 'Test',
  platform_name: 'Preply',
  annual_savings: '$8,000',
  // ... other test data
});
console.log('Email generated successfully');
"
```

## Rollback Plan

If issues arise, the original SendGrid implementation remains in `api/calculator-leads.js` and can be restored by:

1. Reverting package.json dependencies
2. Updating environment variables back to SendGrid
3. Switching API endpoint reference

## Next Steps

1. **Monitor deliverability** metrics in Resend dashboard
2. **A/B test email subject lines** for higher open rates
3. **Implement email sequence** based on user engagement
4. **Add email webhook handlers** for real-time event processing