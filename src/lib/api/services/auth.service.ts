import { apiClient } from "../api-client";

export interface BackendUserOut {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
}

export interface BackendToken {
  access_token: string;
  token_type: string;
}

export const authService = {
  async register(payload: { email: string; password: string; full_name?: string; role?: string }): Promise<BackendUserOut> {
    const { data } = await apiClient.post<BackendUserOut>("/auth/register", payload);
    return data;
  },
  async login(payload: { email: string; password: string }): Promise<BackendToken> {
    const { data } = await apiClient.post<BackendToken>("/auth/login", payload);
    if (typeof window !== "undefined" && data.access_token) window.localStorage.setItem("urbanshield_token", data.access_token);
    return data;
  },
  async me(): Promise<BackendUserOut> {
    const { data } = await apiClient.get<BackendUserOut>("/auth/me");
    return data;
  },
  logout() {
    if (typeof window !== "undefined") window.localStorage.removeItem("urbanshield_token");
  },
};
