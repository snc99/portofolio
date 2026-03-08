import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password is too long"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
