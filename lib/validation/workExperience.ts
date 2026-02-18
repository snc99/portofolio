import { z } from "zod";

const DateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
  .refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Tanggal tidak valid",
  });

/**
 * Base fields
 */
const BaseWorkExperienceSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(3, "Nama perusahaan minimal 3 karakter")
    .max(100, "Nama perusahaan maksimal 100 karakter"),

  position: z
    .string()
    .trim()
    .min(3, "Posisi minimal 3 karakter")
    .max(100, "Posisi maksimal 100 karakter"),

  startDate: DateStringSchema,

  endDate: z.union([DateStringSchema, z.null()]).optional(),

  description: z
    .string()
    .trim()
    .min(3, "Deskripsi minimal 3 karakter")
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional()
    .nullable(),
});

/**
 * CREATE
 */
export const CreateWorkExperienceSchema = BaseWorkExperienceSchema.superRefine(
  ({ startDate, endDate }, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);

    if (endDate) {
      const end = new Date(endDate);

      if (end < start) {
        ctx.addIssue({
          path: ["endDate"],
          message:
            "Tanggal selesai harus setelah atau sama dengan tanggal mulai",
          code: "custom",
        });
      }

      if (end > today) {
        ctx.addIssue({
          path: ["endDate"],
          message: "Tanggal selesai tidak boleh lebih dari hari ini",
          code: "custom",
        });
      }
    }
  },
);

/**
 * UPDATE (partial)
 */
export const UpdateWorkExperienceSchema =
  BaseWorkExperienceSchema.partial().superRefine(
    ({ startDate, endDate }, ctx) => {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
          ctx.addIssue({
            path: ["endDate"],
            message:
              "Tanggal selesai harus setelah atau sama dengan tanggal mulai",
            code: "custom",
          });
        }
      }
    },
  );
