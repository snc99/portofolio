import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.replace("/auth/login");
      }
    }
    return Promise.reject(error);
  },
);

export const fetcher = async <T>(promise: Promise<{ data: T }>): Promise<T> => {
  const response = await promise;
  return response.data;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      document.cookie = "pw_token=; Max-Age=0; path=/;";
      window.location.replace("/auth/login");
    }
    return Promise.reject(error);
  },
);
