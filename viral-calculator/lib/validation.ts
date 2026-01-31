import { z } from 'zod';

// Input validation schemas
export const EmailInputSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email too long')
    .toLowerCase()
    .trim(),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters')
    .trim(),
  inputs: z.object({
    hoursPerWeek: z.number()
      .min(1, 'Hours per week must be at least 1')
      .max(168, 'Hours per week cannot exceed 168')
      .int('Hours per week must be a whole number'),
    hourlyRate: z.number()
      .min(1, 'Hourly rate must be at least $1')
      .max(1000, 'Hourly rate cannot exceed $1000')
      .positive('Hourly rate must be positive'),
    platform: z.enum(['preply', 'italki', 'cambly', 'verbling', 'other'], {
      errorMap: () => ({ message: 'Invalid platform selection' })
    }),
    experience: z.enum(['new', 'intermediate', 'experienced', 'expert'], {
      errorMap: () => ({ message: 'Invalid experience level' })
    }),
    currency: z.string()
      .length(3, 'Currency must be 3 characters')
      .regex(/^[A-Z]{3}$/, 'Invalid currency code')
      .default('USD')
  }),
  results: z.object({
    platform: z.object({
      annualCommission: z.number().positive(),
      annualNet: z.number().positive()
    }),
    comparison: z.object({
      annualDifference: z.number(),
      percentageIncrease: z.number(),
      monthlyDifference: z.number()
    })
  })
});

// Rate limiting validation
export const RateLimitSchema = z.object({
  ip: z.string().ip(),
  userAgent: z.string().max(500),
  timestamp: z.number()
});

export type ValidatedEmailInput = z.infer<typeof EmailInputSchema>;
export type ValidatedRateLimit = z.infer<typeof RateLimitSchema>;

// Validation helper function
export function validateCalculatorInput(data: unknown): ValidatedEmailInput {
  try {
    return EmailInputSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new Error(`Validation failed: ${firstError.message}`);
    }
    throw new Error('Invalid input data');
  }
}