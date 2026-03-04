import { api } from "@/shared/api/axios";

export const socialMediaApi = {
  get: () => api.get("/social-media"),

  create: (formData: FormData) => api.post("/social-media", formData),

  update: (id: string, formData: FormData) =>
    api.patch(`/social-media/${id}`, formData),

  delete: (id: string) => api.delete(`/social-media/${id}`),
};
