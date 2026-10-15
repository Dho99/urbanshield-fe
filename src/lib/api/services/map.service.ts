import { apiClient } from "../api-client";
import type { RiskLayer, DistrictRisk } from "@/types";

export const mapService = {
  async getRiskLayer(): Promise<RiskLayer> {
    const { data } = await apiClient.get<RiskLayer>("/map/risk-layer");
    return data;
  },
  async getInfrastructureLayer(): Promise<RiskLayer> {
    return { type: "FeatureCollection", features: [] };
  },
  async getDistrictDetail(districtId: string): Promise<DistrictRisk> {
    const { data } = await apiClient.get<DistrictRisk>(`/map/districts/${districtId}`);
    return data;
  },
};
