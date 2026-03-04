import { api } from "@/shared/api/axios";

export const profileApi = {
  get: () => api.get("/profile"),

  create: (formData: FormData) => api.post("/profile", formData),

  update: (formData: FormData) => api.put("/profile", formData),

  delete: () => api.delete("/profile"),
};
