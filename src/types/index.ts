export type RiskLevel = "low" | "medium" | "high";

export interface FactorContribution {
  factor: string;
  /** Share of the risk score attributable to this factor, in percent points. */
  contribution: number;
  /** Raw observed value shown next to the contribution. */
  value: string;
}

export interface HistoricalDisasterEvent {
  id: number;
  jenisKejadian: string;
  kelurahan: string;
  lokasi: string;
  tahun: string;
}

export interface DistrictRisk {
  districtId: string;
  district: string;
  riskLevel: RiskLevel;
  /** 0–100 */
  score: number;
  /** 0–100 */
  confidence: number;
  factors: FactorContribution[];
  recommendation: string;
  historicalEvents?: HistoricalDisasterEvent[];
}

export interface RiskPrediction extends DistrictRisk {
  scenario: string;
  predictedAt: string;
}

export interface RiskOverview {
  totalMonitored: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  updatedAt: string;
}

export interface RecommendationAction {
  areaId: string;
  area: string;
  risk: RiskLevel;
  priority: number;
  action: string;
  estimatedImpact: string;
}

export interface MitigationDecision {
  districtId: string;
  district: string;
  risk_summary: {
    districtId: string;
    district: string;
    score: number;
    level: RiskLevel;
    confidence: number;
  };
  why_this_action: Array<{ factor: string; contribution: number; reason: string }>;
  supporting_data: Array<{ factor: string; value: string; contribution: number }>;
  actions: Array<{ title: string; priority: "High" | "Medium" | "Low"; reason: string }>;
  headline_action: string;
}

export interface RiskLayer {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: {
      districtId: string;
      district: string;
      riskLevel: RiskLevel;
      score: number;
    };
    geometry: {
      type: "Polygon";
      coordinates: number[][][];
    };
  }>;
}

export interface Area {
  id?: number;
  slug: string;
  name: string;
  admin_level?: number;
  parent_region?: string | null;
}

export interface AreaDetail extends Area {
  geometry: { type: string; coordinates: unknown } | null;
  risk_summary: { risk_level: RiskLevel; risk_score: number; confidence: number } | null;
}

export interface AreasResponse {
  items: DistrictRisk[];
  total: number;
  limit: number;
  offset: number;
}

export interface Dataset {
  id: number;
  name: string;
  source: string;
  description: string | null;
  last_update: string | null;
  completeness: number | null;
  record_count: number | null;
}

export type GeoJSONFeature = RiskLayer["features"][number];

export interface ExplanationResponse {
  prediction_id: number;
  main_factors: Array<{ feature: string; contribution: number; value: string; impact: string }>;
}
