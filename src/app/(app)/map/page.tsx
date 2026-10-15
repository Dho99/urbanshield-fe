"use client";

import { useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/nav";
import { RiskMap } from "@/components/map/risk-map";
import { DataProvenanceStrip, DistrictDetail, DistrictDetailSkeleton } from "@/components/risk/risk-panels";
import { HistoricalDisasterPanel } from "@/components/risk/historical-disaster-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useDistrictRisk, useRiskLayer } from "@/hooks/queries";
import { ArrowRight, Layers3, MapPinned } from "lucide-react";

export default function MapPage() {
  const [selectedId, setSelectedId] = useState<string | null>("coblong");
  const layer = useRiskLayer();
  const detail = useDistrictRisk(selectedId);

  return (
    <div className="flex min-h-full flex-col">
      <Topbar
        title="Peta Risiko — Investigasi Wilayah"
        subtitle="Mengapa wilayah ini berisiko tinggi? Klik poligon kecamatan untuk menelusuri faktor pendorongnya"
        meta={layer.data ? `${layer.data.features.length} poligon` : undefined}
      />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <div className="grid flex-1 gap-4 xl:grid-cols-3">
          <Card className="flex min-h-[520px] flex-col xl:col-span-2">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <Layers3 className="size-4 text-slate-500" aria-hidden /> Lapisan Risiko Banjir — Kota Bandung (30 Kecamatan)
              </CardTitle>
              <span className="hidden items-center gap-1 font-mono text-[11px] text-slate-500 sm:inline-flex">
                <MapPinned className="size-3" aria-hidden /> positron · MapLibre GL
              </span>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              {layer.isError ? (
                <ErrorState message={(layer.error as Error).message} onRetry={() => layer.refetch()} />
              ) : (
                <div className="relative h-[56vh] min-h-[480px] w-full flex-1 xl:h-full xl:min-h-[560px]">
                  <RiskMap layer={layer.data} isLoading={layer.isPending} selectedId={selectedId} onSelect={setSelectedId} />
                </div>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                <span className="font-medium uppercase tracking-wide text-slate-600">Panduan Penggunaan</span>
                <span className="hidden text-slate-300 sm:inline">—</span>
                <span>Klik poligon → ringkasan kecamatan · Wilayah terpilih disorot dengan garis batas merah</span>
                <Link href="/prediction" className="ml-auto inline-flex items-center gap-1 font-medium text-slate-700 underline hover:no-underline">
                  Jalankan skenario wilayah terpilih <ArrowRight className="size-3" aria-hidden />
                </Link>
              </div>

              {/* Titik Kejadian Banjir Historis (BPBD 2025) di bawah peta */}
              <div className="mt-4 border-t border-slate-200 pt-3">
                <HistoricalDisasterPanel
                  districtId={selectedId}
                  districtName={detail.data?.district}
                  apiEvents={detail.data?.historicalEvents}
                />
              </div>
            </CardContent>
          </Card>

          <Card aria-live="polite" className="flex flex-col xl:sticky xl:top-4 xl:max-h-[calc(100dvh-96px)] xl:overflow-auto">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Panel Kecamatan</CardTitle>
              <span className="font-mono text-[11px] text-slate-400">{selectedId ?? "—"}</span>
            </CardHeader>
            <CardContent className="flex-1">
              {!selectedId && (
                <EmptyState
                  title="Belum ada kecamatan dipilih"
                  description="Klik poligon pada peta untuk melihat tingkat risiko, skor, keyakinan, faktor pendorong, dan rekomendasi mitigasi."
                />
              )}
              {selectedId && detail.isPending && <DistrictDetailSkeleton />}
              {selectedId && detail.isError && (
                <ErrorState message={(detail.error as Error).message} onRetry={() => detail.refetch()} />
              )}
              {selectedId && detail.data && <DistrictDetail detail={detail.data} />}
              {selectedId && detail.data && (
                <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
                  <Link
                    href={`/prediction`}
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                  >
                    Analisis Wilayah Ini <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <Link
                    href="/recommendation"
                    className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  >
                    Lihat Antrean Prioritas
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <DataProvenanceStrip />
      </main>
    </div>
  );
}
