import { api } from "@/lib/axios";
import { USE_MOCK_API } from "@/lib/utils";
import type { DistrictRisk, RiskLayer, RiskPrediction } from "@/types";
import { MOCK_DISTRICTS, MOCK_RISK_LAYER, mockDelay } from "@/api/mock/db";
import type { PredictionInput } from "@/schemas";

const SCENARIO_MULTIPLIER: Record<PredictionInput["scenario"], number> = {
  current: 1,
  heavy_rain_24h: 1.15,
  heavy_rain_72h: 1.30,
  drainage_failure: 1.20,
};

const SCENARIO_LABEL: Record<PredictionInput["scenario"], string> = {
  current: "Kondisi Eksisting (Normal)",
  heavy_rain_24h: "Hujan Lebat 1 Hari (24 Jam)",
  heavy_rain_72h: "Hujan Deras 3 Hari Berturut-turut (72 Jam)",
  drainage_failure: "Kegagalan Sistem Drainase",
};

function applyScenario(base: DistrictRisk, input: PredictionInput): RiskPrediction {
  const score = Math.min(100, Math.round(base.score * SCENARIO_MULTIPLIER[input.scenario]));
  const riskLevel = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
  return { ...base, score, riskLevel, scenario: SCENARIO_LABEL[input.scenario], predictedAt: new Date().toISOString() };
}

export const predictionService = {
  async listDistricts(): Promise<DistrictRisk[]> {
    if (USE_MOCK_API) return mockDelay(MOCK_DISTRICTS);
    const { data } = await api.get<DistrictRisk[]>("/prediction/districts");
    return data;
  },

  async predictRisk(input: PredictionInput): Promise<RiskPrediction> {
    if (USE_MOCK_API) {
      const base = MOCK_DISTRICTS.find((d) => d.districtId === input.districtId);
      if (!base) throw new Error("District not found");
      return mockDelay(applyScenario(base, input), 800);
    }
    const { data } = await api.post<RiskPrediction>("/prediction/predict", input);
    return data;
  },
};

export const mapService = {
  async getRiskLayer(): Promise<RiskLayer> {
    if (USE_MOCK_API) return mockDelay(MOCK_RISK_LAYER);
    const { data } = await api.get<RiskLayer>("/map/risk-layer");
    return data;
  },

  async getDistrictDetail(districtId: string): Promise<DistrictRisk> {
    if (USE_MOCK_API) {
      const found = MOCK_DISTRICTS.find((d) => d.districtId === districtId);
      if (!found) throw new Error("District not found");
      return mockDelay(found);
    }
    const { data } = await api.get<DistrictRisk>(`/map/districts/${districtId}`);
    return data;
  },
};
