import axios, { AxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // for refresh cookie
});

declare module "axios" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface AxiosRequestConfig {
    __isRetry?: boolean;
  }
}

// Interceptor to auto-refresh on 401 and retry once
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as AxiosRequestConfig;
    if (error.response?.status === 401 && !original.__isRetry) {
      original.__isRetry = true;
      try {
        const refresh = await axios.post(`${API_URL}/api/auth/refresh`, {}, { withCredentials: true });
        const newAccessToken = refresh.data.accessToken as string;
        if (newAccessToken) {
          original.headers = original.headers || {};
          original.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(original);
        }
      } catch (_) {}
    }
    return Promise.reject(error);
  }
);


