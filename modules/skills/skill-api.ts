import { api } from "@/shared/api/axios";

export const skillApi = {
  get: (params?: { page?: number; limit?: number }) =>
    api.get("/skills", { params }),

  getOptions: () => api.get("/skills/options"),

  create: (formData: FormData) => api.post("/skills", formData),

  update: (id: string, formData: FormData) =>
    api.patch(`/skills/${id}`, formData),

  delete: (id: string) => api.delete(`/skills/${id}`),
};
