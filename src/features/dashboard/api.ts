import { api } from "@/lib/axios";
import { USE_MOCK_API } from "@/lib/utils";
import type { RiskOverview } from "@/types";
import { MOCK_OVERVIEW, mockDelay } from "@/api/mock/db";

export const dashboardService = {
  async getOverview(): Promise<RiskOverview> {
    if (USE_MOCK_API) return mockDelay(MOCK_OVERVIEW);
    const { data } = await api.get<RiskOverview>("/dashboard/overview");
    return data;
  },
};
