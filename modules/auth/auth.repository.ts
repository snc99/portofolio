import { authApi } from "./auth.api";

export const authRepository = {
  async login(data: { email: string; password: string }) {
    const res = await authApi.login(data);
    return res.data;
  },

  async logout() {
    const res = await authApi.logout();
    return res.data;
  },

  async me() {
    const res = await authApi.me();
    return res.data;
  },
};
