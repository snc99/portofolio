import { api } from "@/shared/api/axios";

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  logout: () => api.post("/auth/logout"),

  me: () => api.get("/auth/me"),
};
