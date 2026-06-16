import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 401 && !url?.includes("/auth/login")) {
      document.cookie = "pw_token=; Max-Age=0; path=/;";
      window.location.replace("/auth/login");
    }

    return Promise.reject(error);
  },
);

export const fetcher = async <T>(promise: Promise<{ data: T }>): Promise<T> => {
  const response = await promise;
  return response.data;
};
