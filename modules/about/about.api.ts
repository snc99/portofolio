import { api } from "@/shared/api/axios";

export const aboutApi = {
  get: () => api.get("/about"),

  create: (formData: FormData) => api.post("/about", formData),

  update: (formData: FormData) => api.put("/about", formData),

  delete: () => api.delete("/about"),
};
