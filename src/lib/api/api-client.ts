import axios, { AxiosError } from "axios";

const raw = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const baseURL = raw.replace(/\/$/, "");

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("urbanshield_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ detail?: string; message?: string }>) => {
    const status = error.response?.status;
    if (status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (!path.startsWith("/login") && !path.startsWith("/register") && !path.startsWith("/api/auth")) {
        window.localStorage.removeItem("urbanshield_token");
      }
    }
    const message = error.response?.data?.detail ?? error.response?.data?.message ?? error.message ?? "Request failed";
    return Promise.reject(new Error(message));
  },
);
