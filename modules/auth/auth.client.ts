import { api, fetcher } from "@/shared/api/axios";
import { ApiResponse } from "@/shared/types/api-response";

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  name: string;
  id: string;
  email: string;
}

export const authService = {
  login: (data: LoginInput) =>
    fetcher<ApiResponse<AuthUser>>(api.post("/api/auth/login", data)),

  logout: () => fetcher<ApiResponse<null>>(api.post("/api/auth/logout")),

  me: () => fetcher<ApiResponse<AuthUser>>(api.get("/api/auth/me")),
};
