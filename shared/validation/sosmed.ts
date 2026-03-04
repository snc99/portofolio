import { z } from "zod";

/**
 * Reusable image validation
 */
const SocialImageSchema = z
  .instanceof(File, { message: "Photo is required" })
  .refine((file) => file.type.startsWith("image/"), {
    message: "File must be an image",
  })
  .refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "File size must be less than 2MB",
  });

const BaseSocialMediaSchema = z.object({
  platform: z
    .string()
    .trim()
    .min(3, "Platform must be at least 3 characters long")
    .max(50, "Platform must be at most 50 characters long"),

  url: z.string().trim().url("URL is not valid"),
});

export const CreateSocialMediaSchema = BaseSocialMediaSchema.extend({
  photo: SocialImageSchema,
});

export const UpdateSocialMediaSchema = BaseSocialMediaSchema.partial().extend({
  photo: SocialImageSchema.optional(),
});
