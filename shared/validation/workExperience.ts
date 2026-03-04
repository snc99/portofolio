import { z } from "zod";

/**
 * Safe date parser (YYYY-MM-DD only)
 */
const DateStringSchema = z
  .string({ required_error: "Date is required" })
  .nonempty("Date is required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

/**
 * Base fields
 */
const BaseWorkExperienceSchema = z.object({
  companyName: z
    .string({ required_error: "Company name is required" })
    .trim()
    .nonempty("Company name is required")
    .min(3, "Company name must be at least 3 characters")
    .max(100, "Company name must be at most 100 characters"),

  position: z
    .string({ required_error: "Position is required" })
    .trim()
    .nonempty("Position is required")
    .min(3, "Position must be at least 3 characters")
    .max(100, "Position must be at most 100 characters"),

  startDate: DateStringSchema,

  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .nullable()
    .optional(),

  description: z
    .string()
    .trim()
    .nonempty("Description is required")
    .min(3, "Description must be at least 3 characters")
    .max(500, "Description must be at most 500 characters"),
});

/**
 * CREATE
 */
export const CreateWorkExperienceSchema = BaseWorkExperienceSchema.superRefine(
  ({ startDate, endDate }, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [sy, sm, sd] = startDate.split("-").map(Number);
    const start = new Date(sy, sm - 1, sd);

    if (start > today) {
      ctx.addIssue({
        path: ["startDate"],
        message: "Start date cannot be in the future",
        code: "custom",
      });
    }

    if (endDate) {
      const [ey, em, ed] = endDate.split("-").map(Number);
      const end = new Date(ey, em - 1, ed);

      if (end < start) {
        ctx.addIssue({
          path: ["endDate"],
          message: "End date cannot be before start date",
          code: "custom",
        });
      }

      if (end > today) {
        ctx.addIssue({
          path: ["endDate"],
          message: "End date cannot be in the future",
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
        const [sy, sm, sd] = startDate.split("-").map(Number);
        const [ey, em, ed] = endDate.split("-").map(Number);

        const start = new Date(sy, sm - 1, sd);
        const end = new Date(ey, em - 1, ed);

        if (end < start) {
          ctx.addIssue({
            path: ["endDate"],
            message: "End date cannot be before start date",
            code: "custom",
          });
        }
      }
    },
  );
