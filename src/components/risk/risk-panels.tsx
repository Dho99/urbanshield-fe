import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { useDistrictRisk, useRiskOverview } from "@/hooks/queries";
import type { DistrictRisk, RiskLevel } from "@/types";
import { AlertTriangle, CheckCircle2, Info, Clock3, Layers3, Building2, Droplets, ArrowRight } from "lucide-react";

export const RISK_COLOR: Record<RiskLevel, string> = {
  high: "#b91c1c",
  medium: "#b45309",
  low: "#15803d",
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  high: "Risiko Tinggi",
  medium: "Risiko Sedang",
  low: "Risiko Rendah",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <Badge variant={level}>{RISK_LABEL[level]}</Badge>;
}

export function RiskOverviewCards() {
  const { data, isPending, isError, error, refetch } = useRiskOverview();

  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-0 border border-slate-200 bg-white xl:grid-cols-4" aria-label="Memuat ringkasan risiko">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-r border-slate-200 p-4 last:border-r-0">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-7 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState message={(error as Error).message} onRetry={() => refetch()} />;
  if (!data) return <EmptyState title="Data ringkasan tidak tersedia" description="Informasi ringkasan risiko belum dapat ditampilkan." />;

  const updated = new Date(data.updatedAt).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
        <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">Ringkasan Operasional — Kota Bandung</p>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
          <Clock3 className="size-3" aria-hidden /> Diperbarui {updated}
        </span>
      </div>
      <dl className="grid grid-cols-2 divide-y divide-slate-200 xl:grid-cols-4 xl:divide-x xl:divide-y-0">
        <div className="px-4 py-4">
          <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Wilayah Dipantau</dt>
          <dd className="mt-1 font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">{data.totalMonitored}</dd>
          <dd className="text-xs text-slate-500">30 kecamatan · Batas administratif Kota Bandung</dd>
        </div>
        <div className="px-4 py-4">
          <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
            <span className="size-2 bg-red-700" aria-hidden /> Risiko Tinggi
          </dt>
          <dd className="mt-1 font-mono text-2xl font-semibold tracking-tight text-red-700 tabular-nums">{data.highRisk}</dd>
          <dd className="text-xs text-slate-500">Butuh tindakan segera</dd>
        </div>
        <div className="px-4 py-4">
          <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
            <span className="size-2 bg-amber-600" aria-hidden /> Risiko Sedang
          </dt>
          <dd className="mt-1 font-mono text-2xl font-semibold tracking-tight text-amber-700 tabular-nums">{data.mediumRisk}</dd>
          <dd className="text-xs text-slate-500">Pantau & siagakan mitigasi</dd>
        </div>
        <div className="px-4 py-4">
          <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
            <span className="size-2 bg-green-700" aria-hidden /> Risiko Rendah
          </dt>
          <dd className="mt-1 font-mono text-2xl font-semibold tracking-tight text-green-700 tabular-nums">{data.lowRisk}</dd>
          <dd className="text-xs text-slate-500">Pemantauan rutin berkala</dd>
        </div>
      </dl>
    </div>
  );
}

export function RiskSummaryPanel({ districtId }: { districtId: string | null }) {
  const { data, isPending, isError, error, refetch } = useDistrictRisk(districtId);

  return (
    <Card aria-live="polite" className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Ringkasan Wilayah</CardTitle>
        <span className="font-mono text-[11px] text-slate-400">ID: {districtId ?? "—"}</span>
      </CardHeader>
      <CardContent className="flex-1">
        {!districtId && (
          <EmptyState title="Belum ada wilayah dipilih" description="Pilih kecamatan pada peta atau dari daftar untuk melihat skor risiko, faktor pendorong, dan rekomendasi mitigasi." />
        )}
        {districtId && isPending && <DistrictDetailSkeleton />}
        {districtId && isError && <ErrorState message={(error as Error).message} onRetry={() => refetch()} />}
        {districtId && data && <DistrictDetail detail={data} />}
      </CardContent>
    </Card>
  );
}

export function DistrictDetailSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Memuat rincian kecamatan">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="border border-slate-200 bg-slate-50 px-3 py-3">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="mt-2 h-1.5 w-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="border-t border-slate-200 pt-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-2 h-12 w-full" />
      </div>
    </div>
  );
}

export function DistrictDetail({ detail }: { detail: DistrictRisk }) {
  const Icon = detail.riskLevel === "high" ? AlertTriangle : detail.riskLevel === "medium" ? Info : CheckCircle2;
  const rainfall = detail.factors.find((f) => f.factor.toLowerCase().includes("rainfall") || f.factor.toLowerCase().includes("hujan"));
  const drainage = detail.factors.find((f) => f.factor.toLowerCase().includes("drainage") || f.factor.toLowerCase().includes("drainase"));
  const elevation = detail.factors.find((f) => f.factor.toLowerCase().includes("elevation") || f.factor.toLowerCase().includes("elevasi"));
  const population = detail.factors.find((f) => f.factor.toLowerCase().includes("population") || f.factor.toLowerCase().includes("penduduk"));

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Wilayah Terpilih</p>
          <p className="text-base font-semibold tracking-tight text-slate-900">Kecamatan {detail.district}</p>
          <p className="font-mono text-xs text-slate-500">Kota Bandung · Jawa Barat</p>
          {detail.historicalEvents && detail.historicalEvents.length > 0 ? (
            <span className="mt-1.5 inline-flex items-center gap-1 bg-blue-50 border border-blue-200 px-1.5 py-0.5 text-[11px] font-semibold text-blue-800">
              <Droplets className="size-3 text-blue-600" aria-hidden />
              {detail.historicalEvents.length} titik banjir tercatat (2025)
            </span>
          ) : (
            <span className="mt-1.5 inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-600">
              Nihil banjir tercatat (2025)
            </span>
          )}
        </div>
        <RiskBadge level={detail.riskLevel} />
      </div>

      <div className="mt-4 border border-slate-200 bg-slate-50 px-3 py-3">
        <div className="flex items-end gap-2">
          <Icon className="mb-1 size-5 shrink-0" style={{ color: RISK_COLOR[detail.riskLevel] }} aria-hidden />
          <p className="font-mono text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{detail.score}</p>
          <p className="pb-1 font-mono text-sm text-slate-500">/ 100</p>
          <span className="ml-auto text-right">
            <span className="block font-mono text-xs font-medium text-slate-900 tabular-nums">{detail.confidence}%</span>
            <span className="block text-[11px] text-slate-500">keyakinan</span>
          </span>
        </div>
        <div className="mt-2 h-1.5 bg-slate-200">
          <div className="h-full" style={{ width: `${detail.score}%`, backgroundColor: RISK_COLOR[detail.riskLevel] }} />
        </div>
        <p className="mt-1.5 text-[11px] text-slate-500">Skor merupakan luaran model skenario saat ini. Ambang batas: rendah &lt;40 · sedang 40–69 · tinggi ≥70.</p>
      </div>

      <div className="mt-4">
        <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
          <Layers3 className="size-3" aria-hidden /> Faktor Pendorong Risiko
        </p>
        <ul className="mt-2 space-y-1.5">
          {detail.factors
            .slice()
            .sort((a, b) => b.contribution - a.contribution)
            .slice(0, 3)
            .map((f) => (
              <li key={f.factor} className="flex items-center justify-between gap-3 border border-slate-200 bg-white px-2.5 py-2">
                <span className="text-sm text-slate-700">{f.factor}</span>
                <span className="shrink-0 font-mono text-sm font-medium tabular-nums text-slate-900">+{f.contribution}%</span>
              </li>
            ))}
        </ul>
        <p className="mt-1 text-[11px] text-slate-500">3 kontributor terbesar dari model terjelaskan (metode SHAP). Rincian lengkap di menu Prediksi →</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="border border-slate-200 bg-white px-2.5 py-2">
          <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
            <Droplets className="size-3" aria-hidden /> Lingkungan
          </p>
          <p className="mt-1 font-mono text-xs text-slate-900">{rainfall?.value ?? "—"} curah hujan</p>
          <p className="font-mono text-xs text-slate-500">{elevation?.value ?? "—"} elevasi</p>
        </div>
        <div className="border border-slate-200 bg-white px-2.5 py-2">
          <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
            <Building2 className="size-3" aria-hidden /> Perkotaan & Infra
          </p>
          <p className="mt-1 font-mono text-xs text-slate-900">{drainage?.value ?? "—"} drainase</p>
          <p className="font-mono text-xs text-slate-500">{population?.value ?? "—"} kepadatan</p>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-200 pt-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Rekomendasi Tindakan</p>
        <p className="mt-1 border-l-2 bg-amber-50/50 py-1 pl-3 text-sm leading-6 text-slate-800" style={{ borderColor: RISK_COLOR[detail.riskLevel] }}>
          {detail.recommendation}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="border border-slate-200 bg-white px-2 py-1 font-mono text-[11px] text-slate-600">Tingkat keyakinan {detail.confidence}%</span>
        <span className="border border-slate-200 bg-white px-2 py-1 font-mono text-[11px] text-slate-600">Geometri resmi · 30 kecamatan</span>
      </div>
    </div>
  );
}

export function DataProvenanceStrip() {
  return (
    <div className="flex flex-wrap items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600">
      <span className="font-medium uppercase tracking-wide text-slate-500">Data & model</span>
      <span className="hidden text-slate-300 sm:inline">—</span>
      <span>
        Sumber data: Jaringan hidrologi OSM · jalan · fasilitas penting · bangunan · tutupan lahan (30 kecamatan) · histori banjir · proksi cuaca
      </span>
      <span className="ml-auto flex items-center gap-1.5">
        <span className="size-1.5 bg-emerald-500" aria-hidden /> Pembaruan: Data Aktif Kota Bandung
      </span>
    </div>
  );
}

export function DataMiningPipelineSection() {
  return (
    <section className="border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900">
            Sumber & Penambangan Data Geospasial
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Proses penambangan 26 fitur spasial dari data mentah primer hingga inferensi risiko terjelaskan (Explainable AI)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] text-slate-600">
            <span className="size-1.5 rounded-full bg-emerald-500" /> 30 Kecamatan WGS84
          </span>
          <span className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] text-slate-600">
            26 Fitur Spasial
          </span>
        </div>
      </div>

      <div className="grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">
        {/* Pilar 1: Hidrologi OSM */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="flex size-7 items-center justify-center border border-blue-200 bg-blue-50 text-blue-700">
              <Droplets className="size-3.5" aria-hidden />
            </span>
            <span className="bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-blue-700">OSM Overpass</span>
          </div>
          <h3 className="mt-2.5 text-xs font-semibold text-slate-900">Hidrologi & Saluran Air</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Ekstraksi vektor garis sungai primer, kanal, dan saluran drainase mikro di tiap kecamatan.
          </p>
          <div className="mt-3 space-y-0.5 border-t border-slate-100 pt-2 font-mono text-[11px] text-slate-500">
            <p className="truncate">• <span className="font-medium text-slate-700">river_length</span> (panjang sungai)</p>
            <p className="truncate">• <span className="font-medium text-slate-700">drainage_density</span> (kerapatan m/m²)</p>
            <p className="truncate">• <span className="font-medium text-slate-700">water_density</span> (rasio per area)</p>
          </div>
        </div>

        {/* Pilar 2: Tutupan Lahan & Bangunan */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="flex size-7 items-center justify-center border border-amber-200 bg-amber-50 text-amber-700">
              <Building2 className="size-3.5" aria-hidden />
            </span>
            <span className="bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-700">OSM Landuse</span>
          </div>
          <h3 className="mt-2.5 text-xs font-semibold text-slate-900">Tutupan Lahan & Bangunan</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Penambangan poligon bangunan fisik, rasio permukaan kedap air, dan persentase area resapan hijau.
          </p>
          <div className="mt-3 space-y-0.5 border-t border-slate-100 pt-2 font-mono text-[11px] text-slate-500">
            <p className="truncate">• <span className="font-medium text-slate-700">building_count</span> (unit bangunan)</p>
            <p className="truncate">• <span className="font-medium text-slate-700">green_ratio</span> (proporsi ruang hijau)</p>
            <p className="truncate">• <span className="font-medium text-slate-700">building_density</span> (unit/km²)</p>
          </div>
        </div>

        {/* Pilar 3: Topografi & Elevasi */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="flex size-7 items-center justify-center border border-emerald-200 bg-emerald-50 text-emerald-700">
              <Layers3 className="size-3.5" aria-hidden />
            </span>
            <span className="bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-emerald-700">SRTM DEM 30m</span>
          </div>
          <h3 className="mt-2.5 text-xs font-semibold text-slate-900">Topografi Cekungan Bandung</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Analisis elevasi digital dan kontur kelerengan untuk mendeteksi zona cekungan geomorfologis rawan genangan.
          </p>
          <div className="mt-3 space-y-0.5 border-t border-slate-100 pt-2 font-mono text-[11px] text-slate-500">
            <p className="truncate">• <span className="font-medium text-slate-700">mean_elevation</span> (mdpl rata-rata)</p>
            <p className="truncate">• <span className="font-medium text-slate-700">slope_gradient</span> (derajat lereng)</p>
            <p className="truncate">• <span className="font-medium text-slate-700">basin_depth</span> (indeks depresi)</p>
          </div>
        </div>

        {/* Pilar 4: Klimatologi & Kependudukan */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="flex size-7 items-center justify-center border border-purple-200 bg-purple-50 text-purple-700">
              <Clock3 className="size-3.5" aria-hidden />
            </span>
            <span className="bg-purple-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-purple-700">BMKG & BPS</span>
          </div>
          <h3 className="mt-2.5 text-xs font-semibold text-slate-900">Curah Hujan & Kependudukan</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Intensitas presipitasi 24j/72j, kepadatan demografi BPS, serta inventarisasi fasilitas darurat bencana.
          </p>
          <div className="mt-3 space-y-0.5 border-t border-slate-100 pt-2 font-mono text-[11px] text-slate-500">
            <p className="truncate">• <span className="font-medium text-slate-700">rainfall_24h/72h</span> (mm presipitasi)</p>
            <p className="truncate">• <span className="font-medium text-slate-700">population_density</span> (jiwa/km²)</p>
            <p className="truncate">• <span className="font-medium text-slate-700">facility_count</span> (posko & RS)</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
          <span className="font-semibold uppercase tracking-wider text-slate-700">Alur Penambangan Data:</span>
          <span>1. Ekstraksi Spasial (OSM + DEM + BMKG)</span>
          <ArrowRight className="size-3 text-slate-400" aria-hidden />
          <span>2. Agregasi Poligon 30 Kecamatan Resmi</span>
          <ArrowRight className="size-3 text-slate-400" aria-hidden />
          <span>3. Pelatihan Model XGBoost & Random Forest</span>
          <ArrowRight className="size-3 text-slate-400" aria-hidden />
          <span>4. TreeSHAP Attribution (Penjelasan Faktor Tanpa Black-Box)</span>
        </div>
      </div>
    </section>
  );
}
