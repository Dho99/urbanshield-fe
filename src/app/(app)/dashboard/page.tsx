"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/nav";
import { RiskMap } from "@/components/map/risk-map";
import {
  DataMiningPipelineSection,
  DataProvenanceStrip,
  RiskOverviewCards,
  RiskSummaryPanel,
} from "@/components/risk/risk-panels";
import { HistoricalDisasterPanel } from "@/components/risk/historical-disaster-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/states";
import { useDistricts, useRiskLayer } from "@/hooks/queries";
import { ArrowRight, AlertTriangle, Layers3, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [selectedId, setSelectedId] = useState<string | null>("coblong");
  const layer = useRiskLayer();
  const districts = useDistricts();

  const selectedDistrict = useMemo(() => {
    return (districts.data ?? []).find((d) => d.districtId === selectedId);
  }, [districts.data, selectedId]);

  // 4 wilayah dengan skor risiko tertinggi untuk fokus prioritas cepat
  const topPriorityDistricts = useMemo(() => {
    const list = districts.data ?? [];
    return [...list].sort((a, b) => b.score - a.score).slice(0, 4);
  }, [districts.data]);

  const highRiskCount = useMemo(() => {
    return (districts.data ?? []).filter((d) => d.riskLevel === "high").length;
  }, [districts.data]);

  return (
    <div className="flex min-h-full flex-col">
      <Topbar
        title="Ringkasan Operasional"
        subtitle="Pemantauan risiko banjir harian dan analisis spasial 30 kecamatan Kota Bandung"
        meta={districts.data ? `${districts.data.length} kecamatan dipantau` : undefined}
      />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Metrik Ikhtisar Tingkat Risiko */}
        <RiskOverviewCards />

        {/* Banner Peringatan Dini Wilayah Kritis */}
        {highRiskCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border border-red-200 bg-red-50/70 px-4 py-2.5 text-sm">
            <div className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="size-4 shrink-0 text-red-700" aria-hidden />
              <span className="font-semibold">Perhatian Segera:</span>
              <span className="text-red-800">
                Terdapat {highRiskCount} kecamatan berisiko tinggi ({topPriorityDistricts.map((d) => `Kec. ${d.district} [${d.score}]`).join(", ")}) yang memerlukan kesiapsiagaan mitigasi.
              </span>
            </div>
            <Link
              href="/recommendation"
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-900 underline hover:no-underline"
            >
              Lihat Antrean Mitigasi <ArrowRight className="size-3" aria-hidden />
            </Link>
          </div>
        )}

        {/* Area Utama: Peta Spasial & Panel Rincian Wilayah */}
        <div className="grid gap-6 xl:grid-cols-12">
          {/* Kolom Kiri: Peta Spasial Beresolusi Tinggi */}
          <Card className="flex flex-col xl:col-span-8">
            <CardHeader className="flex flex-col gap-3 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <CardTitle className="text-sm font-semibold tracking-tight text-slate-900">
                  Peta Spasial Risiko Banjir
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Investigasi batas poligon administratif 30 kecamatan Kota Bandung (WGS84)
                </p>
              </div>

              {/* Pemilih Wilayah Ringkas & Bersih */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Pilih Wilayah:</span>
                <select
                  id="district-quick-select"
                  value={selectedId ?? ""}
                  onChange={(e) => setSelectedId(e.target.value)}
                  disabled={districts.isPending}
                  className="h-8 border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-xs focus:border-slate-900 focus:outline-none"
                >
                  <option value="" disabled>Pilih salah satu kecamatan...</option>
                  {districts.data?.map((d) => (
                    <option key={d.districtId} value={d.districtId}>
                      Kecamatan {d.district} — Skor {d.score} ({d.riskLevel === "high" ? "Tinggi" : d.riskLevel === "medium" ? "Sedang" : "Rendah"})
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>

            {/* Bilah Akses Cepat Wilayah Prioritas Tertinggi */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-2 text-xs">
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <Layers3 className="size-3.5 text-slate-400" aria-hidden /> Prioritas Tertinggi:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {topPriorityDistricts.map((d) => (
                  <button
                    key={d.districtId}
                    type="button"
                    onClick={() => setSelectedId(d.districtId)}
                    className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium transition-colors ${
                      selectedId === d.districtId
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    <span>Kec. {d.district}</span>
                    <span
                      className={`font-mono text-[10px] ${
                        selectedId === d.districtId ? "text-slate-200" : "font-semibold text-red-700"
                      }`}
                    >
                      {d.score}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <CardContent className="flex flex-1 flex-col p-4">
              {layer.isError ? (
                <ErrorState message={(layer.error as Error).message} onRetry={() => layer.refetch()} />
              ) : (
                <div className="h-[500px] min-h-[460px] w-full overflow-hidden border border-slate-200">
                  <RiskMap layer={layer.data} isLoading={layer.isPending} selectedId={selectedId} onSelect={setSelectedId} />
                </div>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <p>
                  <span className="font-semibold text-slate-700">Panduan Interaksi:</span> Klik langsung poligon kecamatan pada peta untuk meninjau rincian pendorong risiko spasial.
                </p>
                <Link
                  href="/map"
                  className="inline-flex items-center gap-1 font-medium text-slate-700 underline hover:no-underline"
                >
                  Buka Peta Mode Investigasi Penuh <ArrowRight className="size-3" aria-hidden />
                </Link>
              </div>

              {/* Catatan Kejadian Bencana Historis (BPBD Kota Bandung 2025) */}
              <div className="mt-4 border-t border-slate-200 pt-3">
                <HistoricalDisasterPanel
                  districtId={selectedId}
                  districtName={selectedDistrict?.district}
                  apiEvents={selectedDistrict?.historicalEvents}
                />
              </div>
            </CardContent>
          </Card>

          {/* Kolom Kanan: Panel Rincian Wilayah Terpilih & Aksi Mitigasi */}
          <div className="flex flex-col gap-4 xl:col-span-4">
            <RiskSummaryPanel districtId={selectedId} />

            {/* Kartu Tombol Aksi Langsung Sesuai Wilayah Terpilih */}
            {selectedId && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-600">
                    <Sparkles className="size-3.5 text-slate-500" aria-hidden /> Tindakan untuk Wilayah Terpilih
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pb-4 text-xs">
                  <Link
                    href={`/prediction`}
                    className="flex items-center justify-between border border-slate-900 bg-slate-900 px-3 py-2.5 font-medium text-white transition-colors hover:bg-slate-800"
                  >
                    <span>Simulasi Prediksi Skenario (24j/72j)</span>
                    <ArrowRight className="size-3.5 text-slate-300" aria-hidden />
                  </Link>
                  <Link
                    href="/recommendation"
                    className="flex items-center justify-between border border-slate-200 bg-white px-3 py-2.5 font-medium text-slate-800 transition-colors hover:bg-slate-50"
                  >
                    <span>Cek Posisi di Antrean Mitigasi</span>
                    <ArrowRight className="size-3.5 text-slate-400" aria-hidden />
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bagian Baru: Sumber Data & Penambangan Fitur Spasial (Spatial Data Mining) */}
        <DataMiningPipelineSection />

        {/* Strip Provenance & Status */}
        <DataProvenanceStrip />
      </main>
    </div>
  );
}
