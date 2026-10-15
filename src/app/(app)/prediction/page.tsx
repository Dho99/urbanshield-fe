"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Topbar } from "@/components/layout/nav";
import { FactorChart } from "@/components/charts/factor-chart";
import { DataProvenanceStrip, RiskBadge, RISK_LABEL } from "@/components/risk/risk-panels";
import { RISK_COLOR } from "@/components/risk/risk-panels";
import { RiskMap } from "@/components/map/risk-map";
import { HistoricalDisasterPanel } from "@/components/risk/historical-disaster-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { EmptyState, Skeleton } from "@/components/ui/states";
import { useDistricts, usePredictRisk, useRiskLayer } from "@/hooks/queries";
import { predictionSchema, type PredictionInput } from "@/schemas";
import type { RiskLayer, RiskLevel } from "@/types";
import { FlaskConical, Info, Layers, MapPin, ArrowRight, ShieldAlert, Sparkles, CloudRain } from "lucide-react";

const SCENARIO_MULTIPLIERS: Record<string, number> = {
  current: 1.0,
  heavy_rain_24h: 1.15,
  heavy_rain_72h: 1.3,
  drainage_failure: 1.2,
};

const SCENARIOS = [
  ["current", "Kondisi Eksisting (Normal)"],
  ["heavy_rain_24h", "Hujan Lebat 1 Hari (24 Jam)"],
  ["heavy_rain_72h", "Hujan Deras 3 Hari Berturut-turut (72 Jam)"],
  ["drainage_failure", "Kegagalan Sistem Drainase"],
] as const;

const SCENARIO_HELP: Record<string, string> = {
  current: "Kondisi dasar berdasarkan faktor pengamatan eksisting di lapangan.",
  heavy_rain_24h: "Simulasi intensitas hujan lebat 1 hari (akumulasi ~145 mm / 24 jam).",
  heavy_rain_72h: "Simulasi curah hujan deras ekstrem selama 3 hari berturut-turut (akumulasi ~285–300 mm) dengan saturasi air tanah 100% dan limpasan maksimal.",
  drainage_failure: "Penurunan kapasitas aliran akibat sumbatan atau sedimentasi drainase (+20%).",
};

export default function PredictionPage() {
  const districts = useDistricts();
  const riskLayer = useRiskLayer();
  const prediction = usePredictRisk();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PredictionInput>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      scenario: "current",
      districtId: "gedebage",
    },
  });

  const scenario = watch("scenario") || "current";
  const selectedDistrictId = watch("districtId") || "gedebage";

  // Jalankan prediksi default saat halaman dimuat pertama kali
  useEffect(() => {
    if (!prediction.data && !prediction.isPending && selectedDistrictId) {
      prediction.mutate({ districtId: selectedDistrictId, scenario });
    }
  }, [selectedDistrictId]);

  // Handler interaktif saat mengklik poligon kecamatan pada peta
  const handleMapSelect = (id: string) => {
    setValue("districtId", id, { shouldValidate: true });
    prediction.mutate({ districtId: id, scenario });
  };

  // Informasi kecamatan yang sedang dipilih
  const selectedDistrict = useMemo(() => {
    if (!districts.data || !selectedDistrictId) return null;
    const norm = (str?: string | null) => (str || "").toLowerCase().replace(/[\s_-]+/g, "");
    const target = norm(selectedDistrictId);
    return districts.data.find((d) => norm(d.districtId) === target || norm(d.district) === target);
  }, [districts.data, selectedDistrictId]);

  // Lapisan GeoJSON dinamis yang HANYA merefleksikan perubahan prediksi pada kecamatan yang dipilih
  const simulatedLayer: RiskLayer | undefined = useMemo(() => {
    if (!riskLayer.data) return undefined;
    const norm = (str?: string | null) => (str || "").toLowerCase().replace(/[\s_-]+/g, "");
    const targetNorm = norm(selectedDistrictId);

    return {
      ...riskLayer.data,
      features: riskLayer.data.features.map((f) => {
        const fNorm = norm(f.properties?.districtId);
        const isSelected = Boolean(targetNorm && (fNorm === targetNorm || norm(f.properties?.district) === targetNorm));

        // Hanya kecamatan yang di-select yang nilainya berubah mengikuti hasil prediksi skenario
        if (isSelected) {
          if (prediction.data && (norm(prediction.data.districtId) === targetNorm || norm(prediction.data.district) === targetNorm)) {
            const score = prediction.data.score;
            const riskLevel: RiskLevel = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
            return {
              ...f,
              properties: {
                ...f.properties,
                score,
                riskLevel,
              },
            };
          }

          // Estimasi sementara saat inferensi sedang berjalan untuk kecamatan terpilih
          const mult = SCENARIO_MULTIPLIERS[scenario] ?? 1.0;
          const baseScore = f.properties?.score ?? 50;
          const simScore = Math.min(99, Math.round(baseScore * mult));
          const simLevel: RiskLevel = simScore >= 70 ? "high" : simScore >= 40 ? "medium" : "low";

          return {
            ...f,
            properties: {
              ...f.properties,
              score: simScore,
              riskLevel: simLevel,
            },
          };
        }

        // Kecamatan lainnya tetap pada kondisi baseline tanpa perubahan
        return f;
      }),
    };
  }, [riskLayer.data, scenario, selectedDistrictId, prediction.data]);

  const onScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as PredictionInput["scenario"];
    setValue("scenario", val);
    if (selectedDistrictId) {
      prediction.mutate({ districtId: selectedDistrictId, scenario: val });
    }
  };

  const onDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setValue("districtId", val, { shouldValidate: true });
    prediction.mutate({ districtId: val, scenario });
  };

  return (
    <div className="flex min-h-full flex-col">
      <Topbar
        title="Prediksi Risiko Banjir"
        subtitle="Simulasi spasial inferensi per kecamatan dan skenario — dilengkapi visualisasi peta risiko dan analisis penyebab SHAP"
      />
      <main className="flex-1 space-y-4 p-4 lg:p-6">
        <div className="grid gap-4 xl:grid-cols-12">
          {/* SISI KIRI: Parameter Simulasi, Visualisasi Peta Spasial, dan Titik Banjir BPBD */}
          <div className="space-y-4 xl:col-span-6">
            {/* Form Parameter Analisis */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FlaskConical className="size-4 text-slate-500" aria-hidden /> Parameter Analisis & Skenario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit((v) => prediction.mutate(v))} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="districtId">Pilih Kecamatan</Label>
                      <Select
                        id="districtId"
                        value={selectedDistrictId}
                        onChange={onDistrictChange}
                        disabled={districts.isPending}
                      >
                        <option value="" disabled>
                          {districts.isPending ? "Memuat daftar kecamatan…" : "Pilih salah satu kecamatan"}
                        </option>
                        {districts.data?.map((d) => (
                          <option key={d.districtId} value={d.districtId}>
                            Kecamatan {d.district} (Skor: {d.score}/100)
                          </option>
                        ))}
                      </Select>
                      {errors.districtId && (
                        <p role="alert" className="text-xs text-red-700">
                          {errors.districtId.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="scenario">Skenario Simulasi</Label>
                      <Select id="scenario" value={scenario} onChange={onScenarioChange}>
                        {SCENARIOS.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </Select>
                      <p className="text-[11px] text-slate-500">{SCENARIO_HELP[scenario] ?? ""}</p>
                      {scenario === "heavy_rain_72h" && (
                        <div className="mt-1 flex items-center gap-1.5 border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-[11px] font-medium text-blue-900">
                          <CloudRain className="size-3.5 text-blue-700 shrink-0" aria-hidden />
                          <span>Simulasi Hujan Ekstrem 3 Hari Berturut-turut (~285 mm) · Potensi banjir meluas</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Sparkles className="size-3.5 text-blue-600" aria-hidden />
                      <span>Model inferensi XGBoost + SHAP terintegrasi langsung dengan peta spasial.</span>
                    </div>

                    <Button type="submit" size="sm" disabled={prediction.isPending}>
                      {prediction.isPending ? "Menganalisis…" : "Jalankan Inferensi"}
                    </Button>
                  </div>

                  {prediction.isError && (
                    <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                      {(prediction.error as Error).message}
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Visualisasi Peta Spasial Risiko Banjir */}
            <Card className="overflow-hidden">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Layers className="size-4 text-blue-600" aria-hidden /> Visualisasi Peta Spasial Risiko Banjir
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Simulasi risiko untuk{" "}
                    <span className="font-semibold text-slate-800">
                      Kecamatan {selectedDistrict?.district || selectedDistrictId}
                    </span>{" "}
                    pada skenario:{" "}
                    <span className="font-semibold text-blue-700">
                      {SCENARIOS.find(([k]) => k === scenario)?.[1]}
                    </span>
                  </p>
                </div>
                <span className="hidden items-center gap-1 border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600 sm:inline-flex">
                  <MapPin className="size-3 text-slate-400" /> Positron · MapLibre GL
                </span>
              </CardHeader>
              <CardContent className="space-y-3 pt-1">
                <div className="relative h-[380px] w-full border border-slate-200">
                  <RiskMap
                    layer={simulatedLayer}
                    isLoading={riskLayer.isPending}
                    selectedId={selectedDistrictId}
                    onSelect={handleMapSelect}
                    className="min-h-[380px]"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Info className="size-3.5 text-slate-400" />
                    <span>Klik poligon kecamatan di peta untuk memilih & menguji analisis instan.</span>
                  </span>
                  <span className="font-medium text-slate-700">
                    Wilayah Terpilih:{" "}
                    <span className="font-semibold text-blue-700 uppercase">
                      {selectedDistrict?.district || selectedDistrictId}
                    </span>
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Rincian Titik Kejadian Banjir Historis (BPBD Kota Bandung 2025) */}
            <HistoricalDisasterPanel
              districtId={selectedDistrictId}
              districtName={selectedDistrict?.district || prediction.data?.district}
            />
          </div>

          {/* SISI KANAN: Hasil Prediksi & Analisis Explainable AI (XAI) */}
          <div className="space-y-4 xl:col-span-6" aria-live="polite">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm">Hasil Prediksi & Analisis Model</CardTitle>
                {prediction.data && <RiskBadge level={prediction.data.riskLevel} />}
              </CardHeader>
              <CardContent>
                {prediction.isPending && (
                  <div className="space-y-3" aria-label="Menganalisis risiko">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-10 w-1/4" />
                    <Skeleton className="h-64 w-full" />
                  </div>
                )}

                {!prediction.data && !prediction.isPending && (
                  <EmptyState
                    title="Belum ada analisis"
                    description="Pilih kecamatan pada dropdown atau klik langsung poligon di peta, lalu sistem akan memproses inferensi risiko beserta kontribusi faktor SHAP."
                  />
                )}

                {prediction.data && (
                  <div className="space-y-5">
                    {/* Ringkasan Skor & Keyakinan */}
                    <div className="border border-slate-200 bg-white">
                      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                            Kecamatan {prediction.data.district}
                          </p>
                          <p className="font-mono text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                            {prediction.data.score}
                            <span className="text-base font-normal text-slate-500"> / 100</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-xs font-medium text-slate-900 tabular-nums">
                            {prediction.data.confidence}% keyakinan model
                          </p>
                          <p className="font-mono text-[11px] text-slate-500">
                            {prediction.data.scenario} · {new Date(prediction.data.predictedAt).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      </div>
                      <div className="px-4 py-2.5">
                        <div className="h-2 bg-slate-200 overflow-hidden">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${prediction.data.score}%`,
                              backgroundColor: RISK_COLOR[prediction.data.riskLevel],
                            }}
                          />
                        </div>
                        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
                          <Info className="size-3" aria-hidden /> Ambang batas kategori: Rendah &lt;40 · Sedang 40–69 · Tinggi ≥70
                        </p>
                      </div>
                    </div>

                    {/* Grafik Kontribusi Faktor SHAP (Explainable AI) */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Analisis Kontribusi Faktor (SHAP / XAI)
                        </h4>
                        <span className="text-[11px] text-slate-500">Bobot pengaruh relatif</span>
                      </div>
                      <FactorChart factors={prediction.data.factors} riskLevel={prediction.data.riskLevel} />
                    </div>

                    {/* Tabel Rincian Faktor Pendorong Skor */}
                    <div className="border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
                        Rincian Metrik & Pengaruh Lapangan
                      </p>
                      <ul className="mt-2 divide-y divide-slate-200 border border-slate-200 bg-white">
                        {prediction.data.factors
                          .slice()
                          .sort((a, b) => b.contribution - a.contribution)
                          .map((f) => (
                            <li key={f.factor} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                              <span className="text-slate-700">
                                {f.factor} <span className="font-mono text-xs text-slate-400">({f.value})</span>
                              </span>
                              <span className="shrink-0 font-mono text-sm font-medium tabular-nums text-slate-900">
                                +{f.contribution}%
                              </span>
                            </li>
                          ))}
                      </ul>
                      <p className="mt-2 text-[11px] text-slate-500">
                        Total kontribusi bobot 100%. Diperhitungkan dari data topografi DEMNAS, kerapatan drainase OSM, dan data historis BPBD.
                      </p>

                      {/* Kotak Rekomendasi Mitigasi */}
                      <div
                        className="mt-3 border-l-4 bg-white p-3 text-sm leading-6 text-slate-800 shadow-2xs"
                        style={{ borderColor: RISK_COLOR[prediction.data.riskLevel] }}
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <ShieldAlert className="size-4 text-slate-600" />
                          <span>Rekomendasi Tindakan Mitigasi:</span>
                        </div>
                        <p className="mt-1 text-slate-700">{prediction.data.recommendation}</p>
                      </div>

                      {/* Tautan Navigasi Cepat */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3">
                        <Link
                          href="/recommendation"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
                        >
                          Buka Antrean Rekomendasi Prioritas <ArrowRight className="size-3" />
                        </Link>
                        <Link
                          href="/map"
                          className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                        >
                          Eksplorasi di Peta Lengkap <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Provenance Footer */}
        <DataProvenanceStrip />
      </main>
    </div>
  );
}
