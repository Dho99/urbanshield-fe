import { apiClient } from "../api-client";
import type { AreaDetail, AreasResponse } from "@/types";

export const areaService = {
  async getAreas(params?: { limit?: number; offset?: number }): Promise<AreasResponse> {
    const { data } = await apiClient.get<AreasResponse>("/areas", { params });
    return data;
  },
  async getAreaDetail(id: string): Promise<AreaDetail> {
    const { data } = await apiClient.get<AreaDetail>(`/areas/${id}`);
    return data;
  },
};
