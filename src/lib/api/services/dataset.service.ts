import { apiClient } from "../api-client";
import type { Dataset } from "@/types";

export const datasetService = {
  async getDatasets(source?: string): Promise<Dataset[]> {
    const { data } = await apiClient.get<Dataset[]>("/datasets", { params: source ? { source } : undefined });
    return data;
  },
};
