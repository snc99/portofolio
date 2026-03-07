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

  cv: CvFileSchema,
  photo: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "File must be an image (JPG/PNG)",
      },
    )
    .refine((file) => file.size <= 8 * 1024 * 1024, {
      message: "Image size must be less than 8MB",
    }),
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

  cv: CvFileSchema.optional(),
  photo: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "File must be an image (JPG/PNG)",
      },
    )
    .refine((file) => file.size <= 8 * 1024 * 1024, {
      message: "Image size must be less than 8MB",
    })
    .optional(),
});
