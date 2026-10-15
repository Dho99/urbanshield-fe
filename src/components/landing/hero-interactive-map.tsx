"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { RiskMap } from "@/components/map/risk-map";
import { Skeleton } from "@/components/ui/states";
import { useRiskLayer, useDistricts } from "@/hooks/queries";
import rawHistoricalData from "@/lib/data/historical_events.json";
import { Droplets, ArrowRight, Layers3, MapPin, Info } from "lucide-react";

const floodEventsMap = rawHistoricalData as Record<string, { id: number; jenisKejadian: string; kelurahan: string; lokasi: string }[]>;

export function HeroInteractiveMap() {
  const [selectedId, setSelectedId] = useState<string | null>("gedebage");
  const { data: layer, isPending } = useRiskLayer();
  const { data: districts, isPending: districtsPending } = useDistricts();

  const selectedDistrict = useMemo(() => {
    return (districts ?? []).find((d) => d.districtId === selectedId);
  }, [districts, selectedId]);

  const floodPoints = useMemo(() => {
    if (!selectedId) return [];
    return floodEventsMap[selectedId] || [];
  }, [selectedId]);

  return (
    <div className="flex h-full flex-col border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Map Header Bar - Tanpa kelap-kelip dot hijau */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <MapPin className="size-3.5 text-blue-400" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Peta Spasial Risiko Banjir
          </span>
          <span className="font-mono text-[10px] text-slate-400">Kota Bandung (WGS84)</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
          <Layers3 className="size-3 text-slate-400" />
          <span>30 Kecamatan</span>
        </div>
      </div>

      {/* Map Area with guaranteed height */}
      <div className="relative h-[420px] min-h-[380px] w-full bg-slate-900 sm:h-[480px]">
        <RiskMap
          layer={layer}
          isLoading={isPending}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        {/* Floating Quick Hint - Tanpa emote */}
        <div className="absolute top-2.5 left-2.5 z-10 hidden items-center gap-1.5 border border-slate-800/80 bg-slate-950/90 px-2.5 py-1 text-[10px] text-slate-300 shadow-sm backdrop-blur-xs sm:inline-flex">
          <Info className="size-3 text-slate-400" />
          <span>Klik poligon pada peta untuk meninjau data wilayah</span>
        </div>
      </div>

      {/* Active Selected District Summary Card */}
      <div className="border-t border-slate-800 bg-slate-900/95 p-3.5">
        {districtsPending ? (
          <div className="space-y-2.5" aria-busy="true" aria-label="Memuat ringkasan kecamatan">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-40 bg-slate-700" />
              <Skeleton className="h-3.5 w-20 bg-slate-700" />
            </div>
            <Skeleton className="h-3 w-64 bg-slate-800" />
            <Skeleton className="h-7 w-32 bg-slate-800" />
          </div>
        ) : selectedDistrict ? (
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-white">
                  Kecamatan {selectedDistrict.district}
                </span>
                <span
                  className={`px-1.5 py-0.2 font-mono text-[10px] font-bold uppercase ${
                    selectedDistrict.riskLevel === "high"
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : selectedDistrict.riskLevel === "medium"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  Skor {selectedDistrict.score} ({selectedDistrict.riskLevel})
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                {floodPoints.length > 0 ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-blue-400">
                    <Droplets className="size-3 text-blue-400" />
                    {floodPoints.length} titik banjir tervalidasi BPBD (2025)
                  </span>
                ) : (
                  <span className="text-slate-400">Nihil catatan banjir resmi 2025</span>
                )}
                <span className="text-slate-600">·</span>
                <span className="font-mono text-[11px] text-slate-400">
                  Keyakinan {selectedDistrict.confidence}%
                </span>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-1.5 border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700 hover:text-white"
            >
              <span>Investigasi Wilayah</span>
              <ArrowRight className="size-3 text-slate-300" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pilih poligon kecamatan pada peta di atas untuk melihat ringkasan.</span>
            <span className="font-mono text-[10px] text-slate-500">30 Kecamatan</span>
          </div>
        )}
      </div>
    </div>
  );
}
