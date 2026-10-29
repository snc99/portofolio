
import { api } from "@/shared/api/axios";

export const contactApi = {
  get: () => api.get("/contact"),

  create: (data: {
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    address?: string | null;
    isAvailable?: boolean;
    showEmail?: boolean;
    showPhone?: boolean;
    showWhatsapp?: boolean;
    showAddress?: boolean;
    showAvailability?: boolean;
  }) => api.post("/contact", data),

  update: (data: {
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    address?: string | null;
    isAvailable?: boolean;
    showEmail?: boolean;
    showPhone?: boolean;
    showWhatsapp?: boolean;
    showAddress?: boolean;
    showAvailability?: boolean;
  }) => api.put("/contact", data),

  delete: () => api.delete("/contact"),
};
