import { escapeHtml, sanitizeHtml } from "../security";

export interface CalculatorWelcomeData {
  first_name: string;
  platform_name: string;
  annual_platform_cost: string;
  annual_savings: string;
  monthly_difference: string;
  percentage_increase: number;
  five_year_platform_cost: string;
  five_year_savings: string;
  suggested_hourly_rate: string;
  break_even_months: number;
  trial_url: string;
  consultation_url: string;
  recommendations: Array<{
    title: string;
    description: string;
    action: string;
  }>;
}

export function createCalculatorWelcomeEmail(data: CalculatorWelcomeData): { html: string; text: string } {
  // Sanitize and escape all user-provided data
  const safeData = {
    first_name: escapeHtml(data.first_name),
    platform_name: escapeHtml(data.platform_name),
    annual_platform_cost: escapeHtml(data.annual_platform_cost),
    annual_savings: escapeHtml(data.annual_savings),
    monthly_difference: escapeHtml(data.monthly_difference),
    percentage_increase: Math.round(Number(data.percentage_increase)),
    five_year_platform_cost: escapeHtml(data.five_year_platform_cost),
    five_year_savings: escapeHtml(data.five_year_savings),
    suggested_hourly_rate: escapeHtml(data.suggested_hourly_rate),
    break_even_months: Math.round(Number(data.break_even_months)),
    trial_url: encodeURI(data.trial_url),
    consultation_url: encodeURI(data.consultation_url),
    recommendations: data.recommendations.map(rec => ({
      title: escapeHtml(rec.title),
      description: escapeHtml(rec.description),
      action: escapeHtml(rec.action)
    }))
  };

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Independence Analysis Results</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
        .header p { color: #e2e8f0; margin: 10px 0 0; font-size: 16px; }
        .content { padding: 40px 30px; }
        .savings-box { background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0; }
        .savings-box h2 { color: white; margin: 0 0 10px; font-size: 32px; font-weight: 800; }
        .savings-box p { color: #d1fae5; margin: 0; font-size: 18px; }
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
        .stat-card { background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-card h3 { margin: 0 0 8px; color: #1e293b; font-size: 24px; font-weight: 700; }
        .stat-card p { margin: 0; color: #64748b; font-size: 14px; }
        .recommendation { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .recommendation h4 { margin: 0 0 8px; color: #92400e; font-size: 16px; font-weight: 600; }
        .recommendation p { margin: 0 0 8px; color: #451a03; font-size: 14px; line-height: 1.5; }
        .recommendation .action { font-weight: 600; color: #92400e; }
        .cta-section { background: #f8fafc; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 10px; }
        .cta-button:hover { opacity: 0.9; }
        .secondary-cta { display: inline-block; background: white; color: #667eea; padding: 16px 32px; border: 2px solid #667eea; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 10px; }
        .footer { background: #1e293b; color: #94a3b8; padding: 30px; text-align: center; font-size: 14px; }
        .footer a { color: #67e8f9; text-decoration: none; }
        @media (max-width: 600px) {
            .stat-grid { grid-template-columns: 1fr; }
            .cta-button, .secondary-cta { display: block; margin: 10px 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Your Independence Analysis</h1>
            <p>Here's how much ${safeData.platform_name} is costing you</p>
        </div>
        
        <div class="content">
            <p>Hi ${safeData.first_name},</p>
            
            <p>Thanks for using our Independence Calculator! Your results are eye-opening...</p>
            
            <div class="savings-box">
                <h2>${safeData.annual_savings}</h2>
                <p>Annual savings potential by going independent</p>
            </div>
            
            <div class="stat-grid">
                <div class="stat-card">
                    <h3>${safeData.annual_platform_cost}</h3>
                    <p>Annual ${safeData.platform_name} Fees</p>
                </div>
                <div class="stat-card">
                    <h3>${safeData.monthly_difference}</h3>
                    <p>Extra Income Per Month</p>
                </div>
                <div class="stat-card">
                    <h3>${safeData.percentage_increase}%</h3>
                    <p>Income Increase</p>
                </div>
                <div class="stat-card">
                    <h3>${safeData.break_even_months} months</h3>
                    <p>Break-even Timeline</p>
                </div>
            </div>
            
            <h3>💡 Your Personalized Recommendations</h3>
            ${safeData.recommendations.map(rec => `
                <div class="recommendation">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                    <p class="action">→ ${rec.action}</p>
                </div>
            `).join('')}
            
            <h3>📈 5-Year Projection</h3>
            <p>If you stay on ${safeData.platform_name}: <strong>${safeData.five_year_platform_cost}</strong> in fees</p>
            <p>If you go independent: <strong>${safeData.five_year_savings}</strong> in savings</p>
            <p><em>That's life-changing money that should stay in YOUR pocket.</em></p>
            
            <div class="cta-section">
                <h3>Ready to Start Your Independence Journey?</h3>
                <p>TutorLingua helps language tutors break free from platform dependency and build thriving independent businesses.</p>
                
                <a href="${safeData.trial_url}" class="cta-button">Start Free Trial</a>
                <a href="${safeData.consultation_url}" class="secondary-cta">Book Strategy Call</a>
            </div>
            
            <p><strong>Pro tip:</strong> Start charging ${safeData.suggested_hourly_rate}/hour for direct bookings (15% above your current rate) to maximize the independence advantage.</p>
            
            <p>Questions? Just reply to this email - I read every message.</p>
            
            <p>To your independence,<br>
            <strong>The TutorLingua Team</strong></p>
        </div>
        
        <div class="footer">
            <p>TutorLingua - Helping language tutors build independent, profitable businesses</p>
            <p><a href="https://tutorlingua.com">tutorlingua.com</a> | <a href="mailto:hello@tutorlingua.com">hello@tutorlingua.com</a></p>
        </div>
    </div>
</body>
</html>`;

  const text = `
🎉 Your Independence Analysis Results

Hi ${safeData.first_name},

Thanks for using our Independence Calculator! Here's your personalized analysis:

💰 ANNUAL SAVINGS POTENTIAL: ${safeData.annual_savings}

Your current situation:
• ${safeData.platform_name} fees: ${safeData.annual_platform_cost}/year
• Monthly opportunity cost: ${safeData.monthly_difference}
• Potential income increase: ${safeData.percentage_increase}%
• Break-even timeline: ${safeData.break_even_months} months

💡 PERSONALIZED RECOMMENDATIONS:

${safeData.recommendations.map(rec => `
${rec.title}
${rec.description}
→ ${rec.action}
`).join('\n')}

📈 5-YEAR PROJECTION:
• Stay on ${safeData.platform_name}: ${safeData.five_year_platform_cost} in fees
• Go independent: ${safeData.five_year_savings} in savings

That's life-changing money that should stay in YOUR pocket.

🚀 NEXT STEPS:

1. Start Free Trial: ${safeData.trial_url}
2. Book Strategy Call: ${safeData.consultation_url}

Pro tip: Start charging ${safeData.suggested_hourly_rate}/hour for direct bookings (15% above your current rate).

Questions? Just reply to this email - I read every message.

To your independence,
The TutorLingua Team

TutorLingua - Helping language tutors build independent, profitable businesses
https://tutorlingua.com | hello@tutorlingua.com
`;

  return { html, text };
}