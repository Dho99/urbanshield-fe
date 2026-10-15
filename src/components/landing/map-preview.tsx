"use client";

import { RiskMap } from "@/components/map/risk-map";
import { useRiskLayer } from "@/hooks/queries";

/** Non-interactive preview of the live risk layer for the landing page. */
export function MapPreview() {
  const { data, isPending } = useRiskLayer();
  return <RiskMap layer={data} isLoading={isPending} selectedId={null} onSelect={() => {}} />;
}
