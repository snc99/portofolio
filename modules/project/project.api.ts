import { api } from "@/shared/api/axios";

export const projectApi = {
  get: () => api.get("/projects"),

  create: (formData: FormData) => api.post("/projects", formData),

  update: (id: string, formData: FormData) =>
    api.patch(`/projects/${id}`, formData),

  delete: (id: string) => api.delete(`/projects/${id}`),
};
