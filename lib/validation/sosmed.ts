import { z } from "zod";

/**
 * Reusable image validation
 */
const SocialImageSchema = z
  .instanceof(File, { message: "Foto wajib diunggah" })
  .refine((file) => file.type.startsWith("image/"), {
    message: "File harus berupa gambar",
  })
  .refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "Ukuran foto maksimal 2MB",
  });

const BaseSocialMediaSchema = z.object({
  platform: z
    .string()
    .trim()
    .min(3, "Platform minimal 3 karakter")
    .max(50, "Platform maksimal 50 karakter"),

  url: z.string().trim().url("URL tidak valid"),
});

export const CreateSocialMediaSchema = BaseSocialMediaSchema.extend({
  photo: SocialImageSchema,
});

export const UpdateSocialMediaSchema = BaseSocialMediaSchema.partial().extend({
  photo: SocialImageSchema.optional(),
});
