import { apiClient } from "../api-client";
import type { DistrictRisk, RiskPrediction, ExplanationResponse } from "@/types";
import type { PredictionInput } from "@/schemas";

export const predictionService = {
  async listDistricts(): Promise<DistrictRisk[]> {
    const { data } = await apiClient.get<DistrictRisk[]>("/prediction/districts");
    return data;
  },
  async predictRisk(input: PredictionInput): Promise<RiskPrediction> {
    const { data } = await apiClient.post<RiskPrediction>("/prediction/predict", input);
    return data;
  },
  async getPredictionExplanation(id: number, districtId: string, scenario = "current"): Promise<ExplanationResponse> {
    const { data } = await apiClient.get<ExplanationResponse>(`/predictions/${id}/explanation`, { params: { districtId, scenario } });
    return data;
  },
};
