import { api } from "@/shared/api/axios";

export const aboutApi = {
  get: () => api.get("/about"),
  create: (data: { description: string }) => api.post("/about", data),
  update: (data: { description: string }) => api.put("/about", data),
  delete: () => api.delete("/about"),
};
