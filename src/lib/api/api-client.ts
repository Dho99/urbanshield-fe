import axios from "axios";
import { toApiError } from "./api-error";

const raw = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1").trim();
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
  (error) => {
    const apiError = toApiError(error);
    if (apiError.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (!path.startsWith("/login") && !path.startsWith("/register") && !path.startsWith("/api/auth")) {
        window.localStorage.removeItem("urbanshield_token");
      }
    }
    return Promise.reject(apiError);
  },
);
