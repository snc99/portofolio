import { z } from "zod";

/**
 * Reusable CV file validation
 */
const CvFileSchema = z
  .instanceof(File, { message: "File CV wajib diunggah" })
  .refine((file) => file.type === "application/pdf", {
    message: "The required file format is PDF.",
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "File size must be less than 5MB.",
  });

/**
 * CREATE
 */
export const CreateProfileSchema = z.object({
  motto: z
    .string()
    .trim()
    .min(5, "The motto must be at least 5 characters long.")
    .max(1000, "The motto must be no more than 1000 characters long."),

  cv: CvFileSchema, // wajib saat create
});

/**
 * UPDATE
 */
export const UpdateProfileSchema = z.object({
  motto: z
    .string()
    .trim()
    .min(5, "The motto must be at least 5 characters long.")
    .max(1000, "The motto must be no more than 1000 characters long.")
    .optional(),

  cv: CvFileSchema.optional(), // opsional saat update
});
