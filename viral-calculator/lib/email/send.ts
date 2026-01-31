import { resend, EMAIL_CONFIG } from "../resend";
import { createClient } from '@supabase/supabase-js';
import { getRequiredEnvVar, generateRequestId } from "../security";
import type { SendEmailParams, SendEmailResult } from "./types";

type Tag = { name: string; value: string };

// Initialize Supabase for email logging with safe environment variables
const supabaseUrl = getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getRequiredEnvVar('SUPABASE_SERVICE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

/**
  * Sends email through Resend with suppression guard and lightweight logging.
  * - Skips suppressed recipients (bounces/complaints) unless allowSuppressed is true
  * - Adds category as a tag for easier Resend filtering
  * - Records a "requested" event to email_events when Supabase is available
  */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const baseMetadata = (() => {
    const metadata: Record<string, unknown> = {
      category: params.category,
      metadata: params.metadata,
    };
    const calculatorType = (params.metadata as { calculatorType?: string } | undefined)?.calculatorType;
    const platform = (params.metadata as { platform?: string } | undefined)?.platform;
    if (calculatorType) metadata.calculatorType = calculatorType;
    if (platform) metadata.platform = platform;
    return metadata;
  })();

  const recipients = Array.isArray(params.to) ? params.to : [params.to];
  const normalized = recipients
    .map((email) => email?.trim())
    .filter((email): email is string => Boolean(email));

  let suppressed: string[] = [];
  if (supabase && !params.allowSuppressed && normalized.length > 0) {
    const { data: suppressionRows } = await supabase
      .from("email_suppressions")
      .select("email")
      .in(
        "email",
        normalized.map((email) => email.toLowerCase())
      );

    const suppressionSet = new Set(
      (suppressionRows ?? []).map((row) => row.email?.toLowerCase()).filter(Boolean)
    );
    suppressed = normalized.filter((email) =>
      suppressionSet.has(email.toLowerCase())
    );
  }

  const deliverable = normalized.filter(
    (email) => !suppressed.includes(email)
  );

  if (deliverable.length === 0) {
    if (supabase && normalized.length > 0) {
      try {
        await supabase
          .from("email_events")
          .insert({
            to_email: normalized.join(","),
            event_type: "suppressed_skip",
            metadata: { ...baseMetadata, suppressed },
          });
      } catch {
        // Ignore logging errors
      }
    }
    return { success: false, suppressed, skipped: true };
  }

  const tags: Tag[] = [];
  if (params.tags?.length) {
    tags.push(...params.tags);
  }
  if (params.category) {
    tags.push({ name: "category", value: params.category });
  }

  // Send email with retry logic and timeout
  const emailData = {
    from: params.from ?? EMAIL_CONFIG.from,
    to: deliverable,
    subject: params.subject,
    html: params.html,
    text: params.text,
    cc: params.cc,
    bcc: params.bcc,
    replyTo: params.replyTo ?? EMAIL_CONFIG.replyTo,
    tags,
    idempotencyKey: params.idempotencyKey,
  };

  const { data, error } = await sendEmailWithRetry(emailData);

  if (error) {
    if (supabase) {
      try {
        await supabase
          .from("email_events")
          .insert({
            message_id: (data as any)?.id ?? null,
            to_email: deliverable.join(","),
            event_type: "error",
            reason: error.message,
            metadata: { ...baseMetadata, suppressed },
          });
      } catch {
        // Ignore logging errors
      }
    }
    return { success: false, suppressed, error: error.message };
  }

  if (supabase) {
    try {
      await supabase
        .from("email_events")
        .insert({
          message_id: (data as any)?.id ?? null,
          to_email: deliverable.join(","),
          event_type: "requested",
          metadata: {
            ...baseMetadata,
            suppressed,
          },
        });
    } catch {
      // Ignore logging errors
    }
  }

  return { success: true, suppressed, data };
}

/**
 * Send email with retry logic and exponential backoff
 */
async function sendEmailWithRetry(emailData: any, maxRetries: number = 3): Promise<any> {
  const requestId = generateRequestId();
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[${requestId}] Email send attempt ${attempt}/${maxRetries}`);
      
      // Add timeout to email send
      const timeoutMs = 10000; // 10 seconds
      const emailPromise = resend.emails.send(emailData);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout')), timeoutMs)
      );
      
      const result = await Promise.race([emailPromise, timeoutPromise]);
      
      console.log(`[${requestId}] Email sent successfully on attempt ${attempt}`);
      return result;
      
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error(`[${requestId}] Email send attempt ${attempt} failed:`, errorMessage);
      
      if (isLastAttempt) {
        console.error(`[${requestId}] All email send attempts failed`);
        throw error;
      }
      
      // Exponential backoff: 2s, 4s, 8s
      const backoffMs = Math.pow(2, attempt) * 1000;
      console.log(`[${requestId}] Retrying after ${backoffMs}ms`);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }
}