    You are a senior frontend engineer responsible for integrating UrbanShield AI frontend with backend services.

The frontend already exists using:

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Better Auth


Your task:

Implement API consumption layer and connect all frontend features with backend services.


==================================================
API CLIENT ARCHITECTURE
==================================================


Create:


src/lib/api/


Structure:


api-client.ts


services/

├── auth.service.ts

├── area.service.ts

├── map.service.ts

├── prediction.service.ts

├── recommendation.service.ts

└── dataset.service.ts



Do not call axios directly inside React components.


==================================================
AXIOS CONFIGURATION
==================================================


Create centralized Axios instance.


Requirements:


- baseURL from environment variable

NEXT_PUBLIC_API_URL


- attach authentication token/session

- handle expired session

- global error interceptor


Example:


axiosInstance.get(
"/api/v1/areas"
)


==================================================
API TYPES
==================================================


Create TypeScript interfaces:


types/


Area

RiskPrediction

RiskFactor

Recommendation

Dataset

GeoJSONFeature


Match backend response schema exactly.


==================================================
SERVICE IMPLEMENTATION
==================================================


Implement:


## Area Service


Functions:


getAreas()

getAreaDetail(id)



## Map Service


Functions:


getRiskLayer()


getInfrastructureLayer()


Return GeoJSON.


Used by map component.



## Prediction Service


Functions:


predictRisk(payload)


getPredictionExplanation(id)



## Recommendation Service


Functions:


getRecommendations(areaId)



## Dataset Service


Functions:


getDatasets()



==================================================
STATE MANAGEMENT
==================================================


Use:


TanStack Query


Create hooks:


hooks/


useAreas()

useRiskLayer()

usePrediction()

useRecommendations()

useDatasets()



Each hook must handle:


- loading
- success
- error
- refetch


==================================================
FRONTEND INTEGRATION
==================================================


Connect API to:


1. Dashboard


Replace mock data.


Use:

- area summary API
- risk statistics API


Display:


- high risk count
- medium risk count
- low risk count


==================================================


2. GIS Map


Consume:


GET /api/v1/map/risk-layer



Render:


- district boundary
- risk polygon
- selected area


==================================================


3. Prediction Page


Flow:


User selects district

↓

Frontend fetch area features

↓

POST prediction request

↓

Display:


Risk score

Risk category

Confidence

Feature contribution


==================================================


4. Recommendation Page


Consume:


GET /recommendations/{area_id}


Display:


Priority table.


==================================================


5. Dataset Monitoring


Consume:


GET /datasets


Display:


Data source status.


==================================================
UX REQUIREMENTS
==================================================


Do not show empty UI when API unavailable.


Implement:


Loading:

Skeleton


Error:

Clear error message


Empty:

No data state


Never hardcode fake production data.


==================================================
ENVIRONMENT CONFIGURATION
==================================================


Create:


.env.local


Example:


NEXT_PUBLIC_API_URL=http://localhost:8000



==================================================
SECURITY
==================================================


Do not store sensitive token manually.

Use Better Auth session mechanism.


Protected pages must verify authentication.


==================================================
FINAL OUTPUT
==================================================


Provide:


1.
API integration architecture


2.
Axios setup


3.
Service layer


4.
React Query hooks


5.
Connected pages


6.
Error handling strategy


7.
Environment setup documentation