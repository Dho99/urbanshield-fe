import { apiClient } from "../api-client";
import type { MitigationDecision, RecommendationAction } from "@/types";

export const recommendationService = {
  async getRecommendations(areaId?: string, params?: { risk?: string; q?: string }): Promise<RecommendationAction[]> {
    if (areaId) {
      const { data } = await apiClient.get<RecommendationAction>(`/recommendations/${areaId}`);
      return [data as unknown as RecommendationAction];
    }
    const { data } = await apiClient.get<RecommendationAction[]>("/recommendations", { params });
    return data;
  },
  async getActions(): Promise<RecommendationAction[]> {
    const { data } = await apiClient.get<RecommendationAction[]>("/recommendations");
    return data;
  },
  async getDecision(areaId: string, scenario = "current"): Promise<MitigationDecision> {
    const { data } = await apiClient.get<MitigationDecision>(`/recommendations/${areaId}/decision`, { params: { scenario } });
    return data;
  },
};
