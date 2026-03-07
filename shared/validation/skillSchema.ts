import { z } from "zod";

/* ================= ENUM ================= */

export const SkillLevelEnum = z.enum([
  "JUNIOR",
  "INTERMEDIATE",
  "SENIOR",
  "EXPERT",
]);

/* ================= FILE VALIDATION ================= */

const ImageFileSchema = z
  .any()
  .refine(
    (file) =>
      !file || (typeof file === "object" && "size" in file && "type" in file),
    { message: "Invalid file" },
  )
  .refine(
    (file) =>
      !file || ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
    { message: "File must be an image (JPG/PNG)" },
  )
  .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
    message: "Image size must be less than 5MB",
  });

/* ================= CREATE ================= */

export const CreateSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" }),

  photo: ImageFileSchema,

  level: SkillLevelEnum.optional(),
});

/* ================= UPDATE ================= */

export const UpdateSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .optional(),

  level: SkillLevelEnum.optional(),

  photo: ImageFileSchema.optional(),
});
