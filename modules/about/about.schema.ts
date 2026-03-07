import { z } from "zod";

const ImageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
    { message: "File must be JPG or PNG" },
  )
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Max image size is 5MB",
  });

export const CreateAboutSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter.")
    .max(2000, "Deskripsi maksimal 2000 karakter."),

  photo: ImageFileSchema.optional(),
});

export const UpdateAboutSchema = CreateAboutSchema.partial();
