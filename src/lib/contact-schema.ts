import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Name is too long."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email.").max(160),
  subject: z.string().trim().max(120, "Subject is too long.").optional().default(""),
  message: z.string().trim().min(10, "Message should be at least 10 characters.").max(5000, "Message is too long (5000 max)."),
  // Spam protection: hidden field that humans leave empty, and form open time (ms since epoch).
  company: z.string().max(0).optional().default(""),
  startedAt: z.number().int().positive(),
});

export type ContactInput = z.input<typeof contactSchema>;
