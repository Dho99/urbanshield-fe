"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "@/features/dashboard/api";
import { mapService as legacyMapService, predictionService as legacyPredictionService } from "@/features/prediction/api";
import { recommendationService as legacyRecommendationService } from "@/features/recommendation/api";
import { areaService } from "@/lib/api/services/area.service";
import { mapService } from "@/lib/api/services/map.service";
import { predictionService } from "@/lib/api/services/prediction.service";
import { recommendationService } from "@/lib/api/services/recommendation.service";
import { datasetService } from "@/lib/api/services/dataset.service";
import { USE_MOCK_API } from "@/lib/utils";
import type { PredictionInput } from "@/schemas";

const useMapService = USE_MOCK_API ? legacyMapService : mapService;
const usePredictionService = USE_MOCK_API ? legacyPredictionService : predictionService;

export function useRiskOverview() {
  return useQuery({ queryKey: ["risk-overview"], queryFn: dashboardService.getOverview });
}

export function useDistricts() {
  return useQuery({ queryKey: ["districts"], queryFn: usePredictionService.listDistricts });
}

export function useAreas(params?: { limit?: number; offset?: number }) {
  return useQuery({ queryKey: ["areas", params], queryFn: () => areaService.getAreas(params) });
}

export function useAreaDetail(id: string | null) {
  return useQuery({ queryKey: ["area-detail", id], queryFn: () => areaService.getAreaDetail(id as string), enabled: id !== null });
}

export function useRiskLayer() {
  return useQuery({ queryKey: ["risk-layer"], queryFn: useMapService.getRiskLayer });
}

export function useInfrastructureLayer() {
  return useQuery({ queryKey: ["infra-layer"], queryFn: mapService.getInfrastructureLayer, enabled: false });
}

export function useDistrictRisk(districtId: string | null) {
  return useQuery({
    queryKey: ["district-risk", districtId],
    queryFn: () => useMapService.getDistrictDetail(districtId as string),
    enabled: districtId !== null,
  });
}

export function usePredictRisk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PredictionInput) => usePredictionService.predictRisk(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-overview"] });
    },
  });
}

export const usePrediction = usePredictRisk;

export function usePredictionExplanation(id: number | null, districtId: string, scenario = "current") {
  return useQuery({
    queryKey: ["prediction-explanation", id, districtId, scenario],
    queryFn: () => predictionService.getPredictionExplanation(id as number, districtId, scenario),
    enabled: id !== null,
  });
}

export function useRecommendations(areaId?: string) {
  return useQuery({
    queryKey: ["recommendations", areaId],
    queryFn: () => {
      if (USE_MOCK_API) return legacyRecommendationService.getActions();
      return recommendationService.getRecommendations(areaId);
    },
  });
}

export function useRecommendationDecision(areaId: string | null, scenario = "current") {
  return useQuery({
    queryKey: ["recommendation-decision", areaId, scenario],
    queryFn: () => recommendationService.getDecision(areaId as string, scenario),
    enabled: areaId !== null && !USE_MOCK_API,
  });
}

export function useDatasets(source?: string) {
  return useQuery({ queryKey: ["datasets", source], queryFn: () => datasetService.getDatasets(source) });
}
