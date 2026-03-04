import { z } from "zod";

export const CreateAboutSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter.")
    .max(2000, "Deskripsi maksimal 2000 karakter."),
});

export const UpdateAboutSchema = CreateAboutSchema.partial();
