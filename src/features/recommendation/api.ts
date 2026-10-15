import { api } from "@/lib/axios";
import { USE_MOCK_API } from "@/lib/utils";
import type { RecommendationAction } from "@/types";
import { MOCK_RECOMMENDATIONS, mockDelay } from "@/api/mock/db";

export const recommendationService = {
  async getActions(): Promise<RecommendationAction[]> {
    if (USE_MOCK_API) return mockDelay(MOCK_RECOMMENDATIONS);
    const { data } = await api.get<RecommendationAction[]>("/recommendations");
    return data;
  },
};
