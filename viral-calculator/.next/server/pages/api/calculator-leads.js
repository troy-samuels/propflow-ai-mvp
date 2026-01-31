"use strict";(()=>{var e={};e.id=907,e.ids=[907],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},1309:e=>{e.exports=import("@supabase/supabase-js")},9926:e=>{e.exports=import("zod")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},5254:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{config:()=>u,default:()=>c,routeModule:()=>d});var n=a(1802),o=a(7153),i=a(6249),s=a(8765),l=e([s]);s=(l.then?(await l)():l)[0];let c=(0,i.l)(s,"default"),u=(0,i.l)(s,"config"),d=new n.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/calculator-leads",pathname:"/api/calculator-leads",bundlePath:"",filename:""},userland:s});r()}catch(e){r(e)}})},2141:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.d(t,{C:()=>l});var n=a(9704),o=a(1309),i=a(2535),s=e([o]);o=(s.then?(await s)():s)[0];let u=(0,i.IN)("NEXT_PUBLIC_SUPABASE_URL"),d=(0,i.IN)("SUPABASE_SERVICE_KEY"),m=(0,o.createClient)(u,d);async function l(e){let t=(()=>{let t={category:e.category,metadata:e.metadata},a=e.metadata?.calculatorType,r=e.metadata?.platform;return a&&(t.calculatorType=a),r&&(t.platform=r),t})(),a=(Array.isArray(e.to)?e.to:[e.to]).map(e=>e?.trim()).filter(e=>!!e),r=[];if(m&&!e.allowSuppressed&&a.length>0){let{data:e}=await m.from("email_suppressions").select("email").in("email",a.map(e=>e.toLowerCase())),t=new Set((e??[]).map(e=>e.email?.toLowerCase()).filter(Boolean));r=a.filter(e=>t.has(e.toLowerCase()))}let o=a.filter(e=>!r.includes(e));if(0===o.length){if(m&&a.length>0)try{await m.from("email_events").insert({to_email:a.join(","),event_type:"suppressed_skip",metadata:{...t,suppressed:r}})}catch{}return{success:!1,suppressed:r,skipped:!0}}let i=[];e.tags?.length&&i.push(...e.tags),e.category&&i.push({name:"category",value:e.category});let s={from:e.from??n.K.from,to:o,subject:e.subject,html:e.html,text:e.text,cc:e.cc,bcc:e.bcc,replyTo:e.replyTo??n.K.replyTo,tags:i,idempotencyKey:e.idempotencyKey},{data:l,error:u}=await c(s);if(u){if(m)try{await m.from("email_events").insert({message_id:l?.id??null,to_email:o.join(","),event_type:"error",reason:u.message,metadata:{...t,suppressed:r}})}catch{}return{success:!1,suppressed:r,error:u.message}}if(m)try{await m.from("email_events").insert({message_id:l?.id??null,to_email:o.join(","),event_type:"requested",metadata:{...t,suppressed:r}})}catch{}return{success:!0,suppressed:r,data:l}}async function c(e,t=3){let a=(0,i.Yi)();for(let r=1;r<=t;r++)try{console.log(`[${a}] Email send attempt ${r}/${t}`);let o=n.m.emails.send(e),i=new Promise((e,t)=>setTimeout(()=>t(Error("Email send timeout")),1e4)),s=await Promise.race([o,i]);return console.log(`[${a}] Email sent successfully on attempt ${r}`),s}catch(i){let e=r===t,n=i instanceof Error?i.message:"Unknown error";if(console.error(`[${a}] Email send attempt ${r} failed:`,n),e)throw console.error(`[${a}] All email send attempts failed`),i;let o=1e3*Math.pow(2,r);console.log(`[${a}] Retrying after ${o}ms`),await new Promise(e=>setTimeout(e,o))}}r()}catch(e){r(e)}})},1288:(e,t,a)=>{a.d(t,{E:()=>n});var r=a(2535);function n(e){let t={first_name:(0,r.Xv)(e.first_name),platform_name:(0,r.Xv)(e.platform_name),annual_platform_cost:(0,r.Xv)(e.annual_platform_cost),annual_savings:(0,r.Xv)(e.annual_savings),monthly_difference:(0,r.Xv)(e.monthly_difference),percentage_increase:Math.round(Number(e.percentage_increase)),five_year_platform_cost:(0,r.Xv)(e.five_year_platform_cost),five_year_savings:(0,r.Xv)(e.five_year_savings),suggested_hourly_rate:(0,r.Xv)(e.suggested_hourly_rate),break_even_months:Math.round(Number(e.break_even_months)),trial_url:encodeURI(e.trial_url),consultation_url:encodeURI(e.consultation_url),recommendations:e.recommendations.map(e=>({title:(0,r.Xv)(e.title),description:(0,r.Xv)(e.description),action:(0,r.Xv)(e.action)}))};return{html:`
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
            <p>Here's how much ${t.platform_name} is costing you</p>
        </div>
        
        <div class="content">
            <p>Hi ${t.first_name},</p>
            
            <p>Thanks for using our Independence Calculator! Your results are eye-opening...</p>
            
            <div class="savings-box">
                <h2>${t.annual_savings}</h2>
                <p>Annual savings potential by going independent</p>
            </div>
            
            <div class="stat-grid">
                <div class="stat-card">
                    <h3>${t.annual_platform_cost}</h3>
                    <p>Annual ${t.platform_name} Fees</p>
                </div>
                <div class="stat-card">
                    <h3>${t.monthly_difference}</h3>
                    <p>Extra Income Per Month</p>
                </div>
                <div class="stat-card">
                    <h3>${t.percentage_increase}%</h3>
                    <p>Income Increase</p>
                </div>
                <div class="stat-card">
                    <h3>${t.break_even_months} months</h3>
                    <p>Break-even Timeline</p>
                </div>
            </div>
            
            <h3>💡 Your Personalized Recommendations</h3>
            ${t.recommendations.map(e=>`
                <div class="recommendation">
                    <h4>${e.title}</h4>
                    <p>${e.description}</p>
                    <p class="action">→ ${e.action}</p>
                </div>
            `).join("")}
            
            <h3>📈 5-Year Projection</h3>
            <p>If you stay on ${t.platform_name}: <strong>${t.five_year_platform_cost}</strong> in fees</p>
            <p>If you go independent: <strong>${t.five_year_savings}</strong> in savings</p>
            <p><em>That's life-changing money that should stay in YOUR pocket.</em></p>
            
            <div class="cta-section">
                <h3>Ready to Start Your Independence Journey?</h3>
                <p>TutorLingua helps language tutors break free from platform dependency and build thriving independent businesses.</p>
                
                <a href="${t.trial_url}" class="cta-button">Start Free Trial</a>
                <a href="${t.consultation_url}" class="secondary-cta">Book Strategy Call</a>
            </div>
            
            <p><strong>Pro tip:</strong> Start charging ${t.suggested_hourly_rate}/hour for direct bookings (15% above your current rate) to maximize the independence advantage.</p>
            
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
</html>`,text:`
🎉 Your Independence Analysis Results

Hi ${t.first_name},

Thanks for using our Independence Calculator! Here's your personalized analysis:

💰 ANNUAL SAVINGS POTENTIAL: ${t.annual_savings}

Your current situation:
• ${t.platform_name} fees: ${t.annual_platform_cost}/year
• Monthly opportunity cost: ${t.monthly_difference}
• Potential income increase: ${t.percentage_increase}%
• Break-even timeline: ${t.break_even_months} months

💡 PERSONALIZED RECOMMENDATIONS:

${t.recommendations.map(e=>`
${e.title}
${e.description}
→ ${e.action}
`).join("\n")}

📈 5-YEAR PROJECTION:
• Stay on ${t.platform_name}: ${t.five_year_platform_cost} in fees
• Go independent: ${t.five_year_savings} in savings

That's life-changing money that should stay in YOUR pocket.

🚀 NEXT STEPS:

1. Start Free Trial: ${t.trial_url}
2. Book Strategy Call: ${t.consultation_url}

Pro tip: Start charging ${t.suggested_hourly_rate}/hour for direct bookings (15% above your current rate).

Questions? Just reply to this email - I read every message.

To your independence,
The TutorLingua Team

TutorLingua - Helping language tutors build independent, profitable businesses
https://tutorlingua.com | hello@tutorlingua.com
`}}},9704:(e,t,a)=>{a.d(t,{K:()=>m,m:()=>p});var r=a(2535);let n=(0,r.xu)("RESEND_API_KEY");class o{constructor(e){this.apiKey=e,this.emails={send:async e=>{if(!this.apiKey)return{error:Error("Resend API key not configured")};try{let t={Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json"};e.idempotencyKey&&(t["Idempotency-Key"]=e.idempotencyKey);let a=await fetch("https://api.resend.com/emails",{method:"POST",headers:t,body:JSON.stringify({from:e.from,to:Array.isArray(e.to)?e.to:[e.to],subject:e.subject,html:e.html,text:e.text,cc:e.cc,bcc:e.bcc,reply_to:e.replyTo,tags:e.tags,headers:e.headers})}),r=await a.json().catch(()=>null);if(!a.ok){let e=r&&(r.message||r.error)||`Resend API request failed with status ${a.status}`;return{error:Error(e)}}return{data:r}}catch(e){return{error:Error(e instanceof Error?e.message:"Unexpected error while sending email with Resend.")}}}}}}class i{constructor(){this.emails={send:async e=>(console.warn("[Resend] Email send skipped (no API key configured)",{to:e.to,subject:e.subject}),{data:{skipped:!0,message:"Resend API key is not configured. Email send skipped."}})}}}n||console.warn("[Resend] RESEND_API_KEY is not set. Emails will be skipped until it is configured.");let s=(0,r.xu)("EMAIL_FROM").trim(),l=(0,r.xu)("EMAIL_REPLY_TO").trim(),c=(0,r.xu)("NEXT_PUBLIC_BASE_URL"),u=(()=>{if(!c)return"tutorlingua.com";try{return new URL(c).hostname||"tutorlingua.com"}catch{return"tutorlingua.com"}})(),d=s&&s.includes("@")?s:`TutorLingua Calculator <calculator@${u}>`;s||console.warn("[Resend] EMAIL_FROM is not set. Using fallback sender address.",{from:d});let m={from:d,replyTo:(l&&l.includes("@")?l:void 0)||`hello@${u}`},p=n?new o(n):new i},2535:(e,t,a)=>{a.d(t,{Dn:()=>d,Xv:()=>o,Yi:()=>s,xu:()=>c,IN:()=>l,Hx:()=>i}),require("isomorphic-dompurify");let r=require("crypto-js");var n=a.n(r);function o(e){return"string"!=typeof e?"":e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;").replace(/\//g,"&#x2F;")}function i(e){return"string"!=typeof e?"":n().SHA256(e.toLowerCase().trim()).toString(n().enc.Hex)}function s(){return n().lib.WordArray.random(16).toString(n().enc.Hex)}function l(e){let t=process.env[e];if(!t)throw Error(`Missing required environment variable: ${e}`);return t}function c(e,t=""){return process.env[e]||t}let u=new Map;function d(e,t=5,a=9e5){let r=Date.now();for(let[e,t]of u.entries())t.reset<r&&u.delete(e);let n=u.get(e);return!n||n.reset<r?(u.set(e,{count:1,reset:r+a}),{success:!0,limit:t,remaining:t-1,reset:new Date(r+a)}):n.count>=t?{success:!1,limit:t,remaining:0,reset:new Date(n.reset)}:(n.count++,u.set(e,n),{success:!0,limit:t,remaining:t-n.count,reset:new Date(n.reset)})}},1644:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.d(t,{iC:()=>i});var n=a(9926),o=e([n]);let s=(n=(o.then?(await o)():o)[0]).z.object({email:n.z.string().email("Invalid email address").max(254,"Email too long").toLowerCase().trim(),firstName:n.z.string().min(1,"First name is required").max(100,"First name too long").regex(/^[a-zA-Z\s'-]+$/,"First name contains invalid characters").trim(),inputs:n.z.object({hoursPerWeek:n.z.number().min(1,"Hours per week must be at least 1").max(168,"Hours per week cannot exceed 168").int("Hours per week must be a whole number"),hourlyRate:n.z.number().min(1,"Hourly rate must be at least $1").max(1e3,"Hourly rate cannot exceed $1000").positive("Hourly rate must be positive"),platform:n.z.enum(["preply","italki","cambly","verbling","other"],{errorMap:()=>({message:"Invalid platform selection"})}),experience:n.z.enum(["new","intermediate","experienced","expert"],{errorMap:()=>({message:"Invalid experience level"})}),currency:n.z.string().length(3,"Currency must be 3 characters").regex(/^[A-Z]{3}$/,"Invalid currency code").default("USD")}),results:n.z.object({platform:n.z.object({annualCommission:n.z.number().positive(),annualNet:n.z.number().positive()}),comparison:n.z.object({annualDifference:n.z.number(),percentageIncrease:n.z.number(),monthlyDifference:n.z.number()})})});function i(e){try{return s.parse(e)}catch(e){if(e instanceof n.z.ZodError){let t=e.errors[0];throw Error(`Validation failed: ${t.message}`)}throw Error("Invalid input data")}}n.z.object({ip:n.z.string().ip(),userAgent:n.z.string().max(500),timestamp:n.z.number()}),r()}catch(e){r(e)}})},8765:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{default:()=>u});var n=a(1309),o=a(2141),i=a(1288),s=a(1644),l=a(2535),c=e([n,o,s]);[n,o,s]=c.then?(await c)():c;let f=(0,l.IN)("NEXT_PUBLIC_SUPABASE_URL"),h=(0,l.IN)("SUPABASE_SERVICE_KEY"),_=(0,n.createClient)(f,h),y={"X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","X-XSS-Protection":"1; mode=block","Referrer-Policy":"strict-origin-when-cross-origin"};async function u(e,t){let a=(0,l.Yi)(),r=Date.now();try{let n,o;if(console.log(`[${a}] API request started`),Object.entries(y).forEach(([e,a])=>{t.setHeader(e,a)}),"POST"!==e.method)return console.warn(`[${a}] Invalid method: ${e.method}`),t.status(405).json({error:"Method not allowed",allowedMethods:["POST"]});let i=e.headers["x-forwarded-for"]||e.connection.remoteAddress||"unknown",c=e.headers["user-agent"]||"unknown",u=(0,l.Dn)(`${i}:${c}`,5,9e5);if(!u.success)return console.warn(`[${a}] Rate limit exceeded for IP: ${i}`),t.setHeader("Retry-After",Math.ceil((u.reset.getTime()-Date.now())/1e3)),t.setHeader("X-RateLimit-Limit",u.limit),t.setHeader("X-RateLimit-Remaining",u.remaining),t.setHeader("X-RateLimit-Reset",u.reset.toISOString()),t.status(429).json({error:"Too many requests. Please try again later.",retryAfter:u.reset});t.setHeader("X-RateLimit-Limit",u.limit),t.setHeader("X-RateLimit-Remaining",u.remaining),t.setHeader("X-RateLimit-Reset",u.reset.toISOString());try{n=(0,s.iC)(e.body),console.log(`[${a}] Input validation passed`)}catch(r){let e=r instanceof Error?r.message:"Invalid input data";return console.warn(`[${a}] Input validation failed: ${e}`),t.status(400).json({error:"Invalid input data",details:e})}let{email:g,firstName:f,inputs:h,results:v}=n,b={email:g.toLowerCase().trim(),first_name:f.trim(),hours_per_week:h.hoursPerWeek,hourly_rate:h.hourlyRate,platform:h.platform,experience_level:h.experience,currency:h.currency,annual_platform_cost:Math.round(v.platform.annualCommission),annual_savings_potential:Math.round(v.comparison.annualDifference),percentage_increase:Math.round(v.comparison.percentageIncrease),monthly_difference:Math.round(v.comparison.monthlyDifference),created_at:new Date().toISOString(),request_id:a,ip_address:i,user_agent:c.substring(0,500),referrer:(e.headers.referer||"").substring(0,500),utm_source:"string"==typeof e.query.utm_source?e.query.utm_source.substring(0,100):null,utm_medium:"string"==typeof e.query.utm_medium?e.query.utm_medium.substring(0,100):null,utm_campaign:"string"==typeof e.query.utm_campaign?e.query.utm_campaign.substring(0,100):null};console.log(`[${a}] Saving lead data for email: ${g}`);let{data:x,error:$}=await _.from("calculator_leads").insert([b]).select().single();if($){if(console.error(`[${a}] Database error:`,$),"23505"===$.code)return t.status(409).json({error:"Email already exists",message:"You have already submitted this email address."});return t.status(500).json({error:"Failed to save lead data",message:"Please try again later."})}console.log(`[${a}] Lead saved with ID: ${x.id}`);try{o=await d(b,v,a),console.log(`[${a}] Email send result: ${o.success?"success":"failed"}`)}catch(e){console.error(`[${a}] Email sending failed:`,e),o={success:!1,error:e instanceof Error?e.message:"Unknown error"}}m(b,a).catch(e=>{console.error(`[${a}] Email sequence enrollment failed:`,e)}),p(b,a).catch(e=>{console.error(`[${a}] Analytics tracking failed:`,e)});let w=Date.now()-r;return console.log(`[${a}] Request completed in ${w}ms`),t.status(200).json({success:!0,leadId:x.id,emailSent:o.success,emailSuppressed:!!o.suppressed&&o.suppressed.length>0,message:o.success?"Analysis sent to your email!":"Analysis saved! Email delivery pending.",processingTime:w})}catch(n){let e=Date.now()-r;return console.error(`[${a}] Unexpected API error:`,n),t.status(500).json({error:"Internal server error",message:"Please try again later.",requestId:a,processingTime:e})}}async function d(e,t,a){console.log(`[${a}] Preparing welcome email`);let{email:r,first_name:n,platform:s,annual_platform_cost:c,annual_savings_potential:u}=e,d=function(e,t){let a=[];switch(e.platform){case"preply":a.push({title:"Preply Commission Strategy",description:`You're paying ${"new"===e.experience_level?"33%":"18%"} commission to Preply. Even experienced tutors lose significant income to fees.`,action:"Consider gradual transition to direct booking to keep 100% of earnings."});break;case"italki":a.push({title:"iTalki Fee Analysis",description:"iTalki's 15% commission plus payment processing fees add up to nearly 18% total cost.",action:"Your professional experience qualifies you for premium independent rates."});break;case"cambly":a.push({title:"Cambly Rate Limitations",description:"Cambly's fixed $10.20/hour severely limits your earning potential.",action:"Independent tutors in your market typically charge 3-4x more for similar lessons."})}return e.hours_per_week>=30?a.push({title:"High-Volume Teacher Benefits",description:`At ${e.hours_per_week} hours/week, you're a professional tutor. Independence offers maximum benefit for full-time teachers.`,action:"Consider immediate transition planning - your volume justifies the business investment."}):e.hours_per_week<=10&&a.push({title:"Part-Time Teacher Strategy",description:"Even part-time tutors benefit from independence, especially with high hourly rates.",action:"Start with direct booking for premium students while keeping platform for discovery."}),e.hourly_rate>=40?a.push({title:"Premium Rate Optimization",description:`Your $${e.hourly_rate}/hour rate suggests premium positioning. Independent tutors can charge 15-25% more.`,action:`Consider increasing to $${Math.round(1.2*e.hourly_rate)}/hour for direct bookings.`}):e.hourly_rate<=15&&a.push({title:"Rate Improvement Opportunity",description:`Your current $${e.hourly_rate}/hour rate has significant upside potential.`,action:"Independent tutors with your experience typically charge $25-40/hour."}),e.annual_savings_potential>=1e4&&a.push({title:"High-Impact Independence",description:`Your potential $${e.annual_savings_potential.toLocaleString()} annual savings justify immediate action.`,action:"Schedule independence consultation - your ROI timeline is excellent."}),"expert"===e.experience_level&&a.push({title:"Expert Teacher Advantage",description:"Your expertise commands premium rates that platforms cap artificially.",action:"Expert independent tutors often charge 50-100% more than platform rates."}),a.slice(0,4)}(e,0);(0,l.IN)("NEXT_PUBLIC_BASE_URL");let m=`${(0,l.IN)("NEXT_PUBLIC_TRIAL_URL")}?source=calculator&email=${encodeURIComponent(r)}&utm_campaign=calculator_welcome`,p=`https://calendly.com/tutorlingua/independence-consultation?prefill_email=${encodeURIComponent(r)}`,f={first_name:n,platform_name:s.charAt(0).toUpperCase()+s.slice(1),annual_platform_cost:`$${c.toLocaleString()}`,annual_savings:`$${u.toLocaleString()}`,monthly_difference:`$${Math.round(u/12).toLocaleString()}`,percentage_increase:Math.round(u/t.platform.annualNet*100),five_year_platform_cost:`$${(5*c).toLocaleString()}`,five_year_savings:`$${(5*u).toLocaleString()}`,suggested_hourly_rate:`$${Math.round(1.15*e.hourly_rate)}`,break_even_months:Math.ceil(468/(u/12)),trial_url:m,consultation_url:p,recommendations:d},{html:h,text:_}=(0,i.E)(f);return await (0,o.C)({to:r,subject:`${n}, you could save ${f.annual_savings} annually 💰`,html:h,text:_,category:"calculator-welcome",tags:[{name:"source",value:"calculator"},{name:"platform",value:s},{name:"savings_tier",value:g(u)},{name:"request_id",value:a}],metadata:{calculatorType:"independence-calculator",platform:s,annualSavings:u,leadId:e.email,requestId:a},idempotencyKey:`calculator-welcome-${(0,l.Hx)(r)}-${Date.now()}`})}async function m(e,t){console.log(`[${t}] Adding to email sequence`);let a=["calculator-lead",`platform-${e.platform}`,`savings-${g(e.annual_savings_potential)}`,`experience-${e.experience_level}`,"independence-sequence"];try{await _.from("email_sequence_enrollments").insert({email:e.email,sequence_type:"calculator-independence",tags:a,enrolled_at:new Date().toISOString(),request_id:t,metadata:{source:"calculator",platform:e.platform,annual_savings:e.annual_savings_potential,hours_per_week:e.hours_per_week,hourly_rate:e.hourly_rate,experience:e.experience_level}}),console.log(`[${t}] Email sequence enrollment successful`)}catch(e){throw console.error(`[${t}] Sequence enrollment error:`,e),e}}async function p(e,t){console.log(`[${t}] Tracking conversion event`);let a=(0,l.Hx)(e.email);e.platform,e.annual_platform_cost,e.annual_savings_potential,e.hours_per_week,e.hourly_rate,e.experience_level,g(e.annual_savings_potential);let r=[];try{let n=process.env.GA4_MEASUREMENT_ID,o=process.env.GA4_API_SECRET;n&&o&&r.push(fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${n}&api_secret=${o}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({client_id:a,events:[{name:"calculator_conversion",parameters:{platform:e.platform,annual_savings:e.annual_savings_potential,user_type:e.experience_level,value:Math.min(e.annual_savings_potential/100,1e3),currency:"USD",request_id:t}}]})}));let i=process.env.FACEBOOK_PIXEL_ID,s=process.env.FACEBOOK_PIXEL_ACCESS_TOKEN;i&&s&&r.push(fetch(`https://graph.facebook.com/v18.0/${i}/events`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({access_token:s,data:[{event_name:"Lead",event_time:Math.floor(Date.now()/1e3),user_data:{em:[a]},custom_data:{content_category:"calculator",value:Math.min(e.annual_savings_potential/100,1e3),currency:"USD",request_id:t}}]})})),await Promise.allSettled(r),console.log(`[${t}] Analytics tracking completed`)}catch(e){throw console.error(`[${t}] Analytics tracking error:`,e),e}}function g(e){return e>=15e3?"high":e>=7500?"medium":e>=3e3?"low":"minimal"}r()}catch(e){r(e)}})},7153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},1802:(e,t,a)=>{e.exports=a(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var a=t(t.s=5254);module.exports=a})();