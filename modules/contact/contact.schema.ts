
import { z } from "zod";

const ContactFields = {
  email: z
    .string()
    .trim()
    .email("Invalid email format.")
    .nullable()
    .optional(),

  phone: z.string().trim().nullable().optional(),

  whatsapp: z.string().trim().nullable().optional(),

  address: z.string().trim().nullable().optional(),

  isAvailable: z.boolean().optional(),

  showEmail: z.boolean().optional(),

  showPhone: z.boolean().optional(),

  showWhatsapp: z.boolean().optional(),

  showAddress: z.boolean().optional(),

  showAvailability: z.boolean().optional(),
};

export const CreateContactSchema = z.object(ContactFields);

export const UpdateContactSchema = CreateContactSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });
