import { getRequiredEnvVar, getOptionalEnvVar } from './security';

const resendApiKey = getOptionalEnvVar('RESEND_API_KEY');
const isProduction = process.env.NODE_ENV === "production";

type EmailPayload = {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  tags?: Array<{ name: string; value: string }>;
  headers?: Record<string, string>;
  idempotencyKey?: string;
};

type EmailResult = {
  data?: Record<string, unknown> | null;
  error?: Error;
};

class ResendClient {
  constructor(private apiKey: string) {}

  emails = {
    send: async (payload: EmailPayload): Promise<EmailResult> => {
      if (!this.apiKey) {
        return { error: new Error("Resend API key not configured") };
      }

      try {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        };

        if (payload.idempotencyKey) {
          headers["Idempotency-Key"] = payload.idempotencyKey;
        }

        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers,
          body: JSON.stringify({
            from: payload.from,
            to: Array.isArray(payload.to) ? payload.to : [payload.to],
            subject: payload.subject,
            html: payload.html,
            text: payload.text,
            cc: payload.cc,
            bcc: payload.bcc,
            reply_to: payload.replyTo,
            tags: payload.tags,
            headers: payload.headers,
          }),
        });

        const body = await response.json().catch(() => null);

        if (!response.ok) {
          const message =
            (body && (body.message || body.error)) ||
            `Resend API request failed with status ${response.status}`;
          return { error: new Error(message) };
        }

        return {
          data: body,
        };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unexpected error while sending email with Resend.";
        return { error: new Error(message) };
      }
    },
  };
}

class NoopResendClient {
  constructor() {}

  emails = {
    send: async (payload: EmailPayload): Promise<EmailResult> => {
      const message = "Resend API key is not configured. Email send skipped.";
      console.warn("[Resend] Email send skipped (no API key configured)", {
        to: payload.to,
        subject: payload.subject,
      });
      return { data: { skipped: true, message } };
    },
  };
}

if (!resendApiKey) {
  console.warn(
    "[Resend] RESEND_API_KEY is not set. Emails will be skipped until it is configured."
  );
}

const emailFrom = getOptionalEnvVar('EMAIL_FROM').trim();
const emailReplyTo = getOptionalEnvVar('EMAIL_REPLY_TO').trim();
const publicAppUrl = getOptionalEnvVar('NEXT_PUBLIC_BASE_URL');

const fallbackDomain = (() => {
  if (!publicAppUrl) return "tutorlingua.com";
  try {
    const url = new URL(publicAppUrl);
    return url.hostname || "tutorlingua.com";
  } catch {
    return "tutorlingua.com";
  }
})();

const resolvedEmailFrom =
  emailFrom && emailFrom.includes("@")
    ? emailFrom
    : `TutorLingua Calculator <calculator@${fallbackDomain}>`;

if (!emailFrom) {
  console.warn("[Resend] EMAIL_FROM is not set. Using fallback sender address.", {
    from: resolvedEmailFrom,
  });
}

/**
 * Email configuration
 */
export const EMAIL_CONFIG = {
  from: resolvedEmailFrom,
  replyTo:
    (emailReplyTo && emailReplyTo.includes("@") ? emailReplyTo : undefined) ||
    `hello@${fallbackDomain}`,
} as const;

export const resend = resendApiKey
  ? new ResendClient(resendApiKey)
  : new NoopResendClient();