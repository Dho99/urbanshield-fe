# Frontend ↔ Backend API — Reference

`NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` → `src/lib/api/api-client.ts` `axios baseURL raw.replace(/\/$/,"") timeout 15000 withCredentials true` + `Bearer urbanshield_token` + `401` clear + `detail||message` normalize (`src/lib/axios.ts` re-export `apiClient as api`). `USE_MOCK_API = NEXT_PUBLIC_USE_MOCK !== "false"` default true.

## Services `src/lib/api/services/`

| Service | Method | Path | Returns |
|---|---|---|---|
| auth | `register(payload)` | `POST /auth/register {email,password,full_name?,role?}` | `BackendUserOut{id,email,full_name,role,is_active}` |
|  | `login(payload)` | `POST /auth/login` | `Token{access_token}` → `localStorage urbanshield_token` |
|  | `me()` | `GET /auth/me` Bearer | `BackendUserOut` |
| area | `getAreas({limit,offset})` | `GET /areas` | `AreasResponse{items:DistrictRisk[], total,limit,offset}` paginated 1-100 |
|  | `getAreaDetail(id)` | `GET /areas/{id}` | `AreaDetail{slug,name,admin_level,parent_region,geometry,risk_summary}` |
| map | `getRiskLayer()` | `GET /map/risk-layer` | `RiskLayer FeatureCollection Polygon {districtId,district,riskLevel,score}` |
|  | `getInfrastructureLayer()` | — | stub `FeatureCollection []` (no backend, PRD expects) |
|  | `getDistrictDetail(id)` | `GET /map/districts/{id}` | `DistrictRisk` · 404 |
| prediction | `listDistricts()` | `GET /prediction/districts` | `DistrictRisk[]` |
|  | `predictRisk(input)` | `POST /prediction/predict {districtId, scenario: current|heavy_rain_24h|heavy_rain_72h|drainage_failure, date?}` | `RiskPrediction+{scenario label, predictedAt ISO}` multiplier `1/1.12/1.25/1.18` |
|  | `getPredictionExplanation(id,districtId,scenario)` | `GET /predictions/{id}/explanation?districtId&scenario` id ignored | `ExplanationResponse{prediction_id, main_factors[]}` |
| recommendation | `getRecommendations(areaId?,{risk,q})` | `GET /recommendations[/{areaId}]?risk&q` | `RecommendationAction[]` |
| dataset | `getDatasets(source?)` | `GET /datasets?source=OSM|BNPB|BMKG|BPS|DEM` | `Dataset[]` |
| dashboard (feature) | `getOverview()` | `GET /dashboard/overview` | `RiskOverview{totalMonitored,highRisk,mediumRisk,lowRisk,updatedAt}` |

Legacy `src/features/dashboard|prediction|recommendation/api.ts` mock-aware wrappers delegate to above when `USE_MOCK_API=false`.

## Hooks `src/hooks/queries.ts`

| Hook | Key | Fn | Notes |
|---|---|---|---|
| `useRiskOverview()` | `["risk-overview"]` | `dashboard.getOverview` | always |
| `useDistricts()` | `["districts"]` | `prediction.listDistricts` | mock-aware |
| `useAreas(params)` | `["areas",params]` | `area.getAreas` | live only |
| `useAreaDetail(id)` | `["area-detail",id]` | `area.getAreaDetail` | `enabled id!==null` |
| `useRiskLayer()` | `["risk-layer"]` | `map.getRiskLayer` | mock-aware |
| `useInfrastructureLayer()` | `["infra-layer"]` | `map.getInfrastructureLayer` | `enabled:false` stub |
| `useDistrictRisk(id)` | `["district-risk",id]` | `map.getDistrictDetail` | mock-aware |
| `usePredictRisk()` / `usePrediction` | mutation | `prediction.predictRisk` | `invalidate ["risk-overview"]` |
| `usePredictionExplanation(id,districtId,scenario)` | `["prediction-explanation",id,districtId,scenario]` | `prediction.getPredictionExplanation` | live only |
| `useRecommendations(areaId?)` | `["recommendations",areaId]` | `recommendation.getRecommendations` | mock `getActions` else live |
| `useDatasets(source?)` | `["datasets",source]` | `dataset.getDatasets` | live |

`createQueryClient {staleTime 60s, gcTime 5m, retry 1, refetchOnWindowFocus false}`.

## Types `src/types/index.ts`

`RiskLevel low|med|high`, `FactorContribution{factor,contribution,value}`, `DistrictRisk{districtId,district,riskLevel,score,confidence,factors[],recommendation}`, `RiskPrediction+{scenario,predictedAt}`, `RiskOverview`, `RecommendationAction{areaId,area,risk,priority,action,estimatedImpact}`, `RiskLayer`, `Area/AreaDetail{risk_summary{risk_level,risk_score,confidence}}`, `AreasResponse`, `Dataset{id,name,source,description,last_update,completeness,record_count}`, `ExplanationResponse`, `GeoJSONFeature`. Input `src/schemas/index.ts` `PredictionInput{districtId, scenario enum, date?}`.

Mapping: backend snake `risk_level`→`riskLevel`, `AreasResponse.items` typed `DistrictRisk[]` (mismatch `Area` intended), `prediction_id` ignored (always 0).

## Setup/Seed/Origin/Start/Test

Same as root/backend README — `NEXT_PUBLIC_USE_MOCK=false` to go live after `backend python -m scripts.seed --reset` (30 districts) → verify tiles `FeatureCollection features 30` at `http://localhost:3005/map`.
