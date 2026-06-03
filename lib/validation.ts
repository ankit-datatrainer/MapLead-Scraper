import { z } from "zod";

export const newScrapeSchema = z.object({
  keyword: z.string().min(2, "Keyword must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  category: z.string().optional(),
  radius: z.coerce.number().min(1).max(50),
  resultLimit: z.coerce.number().min(1).max(50000),
  apifyApiKey: z.string().min(8, "API token looks too short"),
  hasPhone: z.boolean().default(false),
  hasWebsite: z.boolean().default(false),
  minRating: z.coerce.number().min(0).max(5).nullable().optional(),
  minReviews: z.coerce.number().min(0).nullable().optional(),
});

export type NewScrapeInput = z.infer<typeof newScrapeSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, "Name is required"),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const apiKeySchema = z.object({
  apifyApiKey: z.string().min(8, "API token looks too short"),
});

export type ApiKeyInput = z.infer<typeof apiKeySchema>;
