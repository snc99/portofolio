import { z } from "zod";

/**
 * Reusable CV file validation
 */
const CvFileSchema = z
  .instanceof(File, { message: "File CV wajib diunggah" })
  .refine((file) => file.type === "application/pdf", {
    message: "Format file harus PDF",
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Ukuran file maksimal 5MB",
  });

/**
 * CREATE
 */
export const CreateProfileSchema = z.object({
  motto: z
    .string()
    .trim()
    .min(5, "Motto minimal 5 karakter")
    .max(1000, "Motto maksimal 1000 karakter"),

  cv: CvFileSchema,
});

/**
 * UPDATE
 */
export const UpdateProfileSchema = z.object({
  motto: z
    .string()
    .trim()
    .min(5, "Motto minimal 5 karakter")
    .max(1000, "Motto maksimal 1000 karakter")
    .optional(),

  cv: CvFileSchema.optional(),
});
