import { z } from "zod";

/**
 * Reusable image file validation
 */
const ImageFileSchema = z
  .instanceof(File, { message: "File gambar tidak valid" })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Ukuran gambar maksimal 5MB",
  })
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    {
      message: "Format gambar harus jpg/png/webp",
    },
  );

/**
 * Base schema
 */
const BaseProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter")
    .max(100, "Judul maksimal 100 karakter"),

  description: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter"),

  link: z
    .string()
    .trim()
    .url("Harus berupa URL yang valid")
    .optional()
    .or(z.literal("")),

  skillIds: z
    .array(z.string().uuid("ID skill harus berupa UUID"))
    .min(1, "Minimal satu skill harus dipilih"),
});

/**
 * CREATE
 */
export const CreateProjectSchema = BaseProjectSchema.extend({
  projectImage: ImageFileSchema.optional().nullable(),
});

/**
 * UPDATE (partial)
 */
export const UpdateProjectSchema = BaseProjectSchema.partial().extend({
  projectImage: ImageFileSchema.optional().nullable(),
});
