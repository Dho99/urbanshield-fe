"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Droplets,
  ArrowRight,
  Layers3,
  MapPin,
  ShieldAlert,
  BarChart3,
  Cpu,
  FlaskConical,
  CheckCircle2,
  Building2,
  Activity,
  AlertTriangle,
} from "lucide-react";

interface ScenarioInfo {
  id: string;
  label: string;
  badge: string;
  avgScore: number;
  highRiskCount: number;
  rainfall: string;
  drainageState: string;
  description: string;
  criticalDistricts: string[];
}

const SCENARIOS: ScenarioInfo[] = [
  {
    id: "current",
    label: "Kondisi Eksisting",
    badge: "Baseline Normal",
    avgScore: 42,
    highRiskCount: 0,
    rainfall: "65 mm / 24h",
    drainageState: "100% Berfungsi Normal",
    description: "Kondisi operasional normal harian. Sebagian besar wilayah berada di tier Rendah (<40) dan Sedang (40–69). Tidak ada genangan darurat aktif.",
    criticalDistricts: ["Gedebage (52)", "Rancasari (48)", "Astana Anyar (46)"],
  },
  {
    id: "heavy_rain_24h",
    label: "Hujan Lebat 24 Jam",
    badge: "Stres Menengah",
    avgScore: 68,
    highRiskCount: 4,
    rainfall: "140 mm / 24h",
    drainageState: "80% Kapasitas Desain",
    description: "Akumulasi hujan intensif selama 24 jam. Genangan meluas pada cekungan Bandung Timur dan wilayah tangkapan air Citepus.",
    criticalDistricts: ["Gedebage (76)", "Rancasari (74)", "Bojongloa Kaler (71)", "Astana Anyar (70)"],
  },
  {
    id: "heavy_rain_72h",
    label: "Hujan Ekstrem 72 Jam",
    badge: "Bencana Kritis",
    avgScore: 84,
    highRiskCount: 12,
    rainfall: "260 mm / 72h",
    drainageState: "Kapasitas Jenuh (>100%)",
    description: "Skenario hujan badai ekstrem berkepanjangan. Backwater sungai Citarum memicu status siaga 1 kebencanaan di 12 kecamatan.",
    criticalDistricts: ["Gedebage (89)", "Rancasari (87)", "Bandung Kidul (82)", "Astana Anyar (80)", "Sukajadi (78)"],
  },
  {
    id: "drainage_failure",
    label: "Kegagalan Drainase",
    badge: "Penyumbatan Saluran",
    avgScore: 75,
    highRiskCount: 7,
    rainfall: "95 mm / 24h",
    drainageState: "Sedimen & Sumbatan 50%",
    description: "Simulasi kegagalan drainase perkotaan akibat sedimentasi parah dan sampah di saluran primer & sekunder saat hujan deras.",
    criticalDistricts: ["Cicendo (78)", "Andir (76)", "Sukajadi (75)", "Coblong (72)"],
  },
];

const VALIDATED_DISTRICTS = [
  {
    id: "gedebage",
    name: "Gedebage",
    score: 52,
    risk: "medium",
    floodCount: 7,
    elevation: "668 mdpl (Titik Terendah)",
    drainage: "0.8 km / km²",
    keyLocations: [
      "Cluster Tulip & Palem, Komplek Bumi Adipura (RW 09 & 10)",
      "Jl. Simpang 3 Derwati (RW 03)",
      "Jl. Rancanumpang (RT 01–05, RW 01–03)",
      "Kel. Cimincrang (RT 03 RW 05)",
    ],
  },
  {
    id: "rancasari",
    name: "Rancasari",
    score: 48,
    risk: "medium",
    floodCount: 8,
    elevation: "672 mdpl",
    drainage: "1.1 km / km²",
    keyLocations: [
      "Kel. Cisaranten Kidul (Jl. Terusan Rancagoong RW 04)",
      "Jl. Rancasawo (RT 01–09 RW 20, RW 19, RW 18)",
      "Bantaran Kali Cipamokolan",
    ],
  },
  {
    id: "astana-anyar",
    name: "Astana Anyar",
    score: 46,
    risk: "medium",
    floodCount: 3,
    elevation: "704 mdpl",
    drainage: "1.4 km / km²",
    keyLocations: [
      "Jl. Pagarsih & Astanaanyar (RT 01, 02 RW 07)",
      "Gg. Tresna Asih, Kel. Cibadak (RT 02 RW 07)",
      "Daerah Aliran Sungai Citepus",
    ],
  },
  {
    id: "sukajadi",
    name: "Sukajadi",
    score: 58,
    risk: "medium",
    floodCount: 3,
    elevation: "732 mdpl",
    drainage: "1.5 km / km²",
    keyLocations: [
      "Gg. Sukabekti I (RT 10 RW 06, RW 03, RW 04)",
      "Jl. Sukajadi Gg. Eme Atas (RW 10)",
      "Kelurahan Sukabungah & Pasteur",
    ],
  },
];

export function InteractiveShowcase() {
  const [activeScenario, setActiveScenario] = useState<ScenarioInfo>(SCENARIOS[0]);
  const [activeDistrict, setActiveDistrict] = useState(VALIDATED_DISTRICTS[0]);

  return (
    <div className="space-y-12">
      {/* Visual Showcase 1: Multi-Scenario Stress Simulation Engine */}
      <section className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Fitur Unggulan 01 · Simulasi Multiskenerio
              </p>
              <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                Simulator Stres Hidrologis & Beban Drainase (XGBoost)
              </h2>
            </div>
            <span className="border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-slate-700">
              Inferensi Real-Time
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Scenario Tab Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveScenario(s)}
                className={`flex flex-col p-3 text-left transition-all ${
                  activeScenario.id === s.id
                    ? "border-2 border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wide opacity-80">
                    {s.badge}
                  </span>
                  {activeScenario.id === s.id && (
                    <CheckCircle2 className="size-3 text-emerald-400" aria-hidden />
                  )}
                </div>
                <span className="mt-1 text-xs font-semibold sm:text-sm">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Scenario Results Display Card */}
          <div className="mt-4 grid gap-4 border border-slate-200 bg-slate-50/70 p-4 lg:grid-cols-12 lg:items-center">
            <div className="space-y-2 lg:col-span-7">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm">
                  {activeScenario.label}
                </span>
                <span className="border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-mono text-slate-600">
                  Curah Hujan: {activeScenario.rainfall}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">
                {activeScenario.description}
              </p>
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-slate-700">Wilayah Paling Terdampak:</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {activeScenario.criticalDistricts.map((d) => (
                    <span
                      key={d}
                      className="border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] font-medium text-slate-800"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:col-span-5">
              <div className="border border-slate-200 bg-white p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Rata-rata Skor Risiko
                </p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-bold tracking-tight text-slate-900">
                    {activeScenario.avgScore}
                  </span>
                  <span className="font-mono text-xs text-slate-500">/ 100</span>
                </div>
                <div className="mt-2 h-1.5 w-full bg-slate-100">
                  <div
                    className="h-full bg-slate-900 transition-all duration-300"
                    style={{ width: `${activeScenario.avgScore}%` }}
                  />
                </div>
              </div>

              <div className="border border-slate-200 bg-white p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Wilayah Risiko Tinggi
                </p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span
                    className={`font-mono text-2xl font-bold tracking-tight ${
                      activeScenario.highRiskCount > 0 ? "text-red-700" : "text-emerald-700"
                    }`}
                  >
                    {activeScenario.highRiskCount}
                  </span>
                  <span className="font-mono text-xs text-slate-500">/ 30 Kec.</span>
                </div>
                <p className="mt-2 font-mono text-[10px] text-slate-500">
                  Kondisi Drainase: {activeScenario.drainageState}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Dijalankan melalui engine inferensi XGBoost Regressor terlatih</span>
            <Link
              href="/prediction"
              className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:underline"
            >
              Coba Simulator Prediksi Penuh <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Showcase 2: Explainable AI & Real BPBD Field Data */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* SHAP Factor Explainability Visual Card */}
        <div className="border border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex size-7 items-center justify-center bg-slate-900 text-white">
              <Cpu className="size-3.5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Fitur Unggulan 02 · Transparansi Keputusan
              </p>
              <h3 className="text-sm font-semibold text-slate-900">
                Explainable AI (SHAP TreeExplainer)
              </h3>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            Setiap prediksi didukung dekomposisi faktor marjinal matematis SHAP. Memecahkan masalah model <i>black-box</i> agar rekomendasi dapat dipertanggungjawabkan pada rapat koordinasi dinas.
          </p>

          {/* Visual Bars for SHAP Factors */}
          <div className="mt-4 space-y-2.5">
            {[
              { factor: "Intensitas Curah Hujan Spasial", pct: 69, value: "142 mm / 24h", color: "bg-blue-600" },
              { factor: "Morfometri Elevasi Cekungan Citarum", pct: 14, value: "668 mdpl", color: "bg-amber-600" },
              { factor: "Kapasitas Jaringan Drainase Primer", pct: 10, value: "0.8 km / km²", color: "bg-slate-700" },
              { factor: "Kepadatan Jaringan Jalan & Bangunan", pct: 7, value: "2.9 km / km²", color: "bg-slate-500" },
            ].map((f) => (
              <div key={f.factor} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{f.factor}</span>
                  <span className="font-mono text-slate-600">+{f.pct}% ({f.value})</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100">
                  <div className={`h-full ${f.color}`} style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Dekomposisi SHAP TreeExplainer</span>
            <span className="font-mono text-[10px]">Akurasi R² &gt; 0.90</span>
          </div>
        </div>

        {/* Validasi Empiris 46 Titik Banjir BPBD */}
        <div className="border border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex size-7 items-center justify-center bg-blue-600 text-white">
              <Droplets className="size-3.5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Fitur Unggulan 03 · Validasi Lapangan
              </p>
              <h3 className="text-sm font-semibold text-slate-900">
                46 Titik Kejadian Banjir BPBD Kota Bandung (2025)
              </h3>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            Model bukan sekadar kalkulasi teori. Setiap prediksi disinkronisasikan langsung dengan rekapitulasi titik kejadian banjir nyata dari BPBD Kota Bandung.
          </p>

          {/* Quick District Switcher Pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {VALIDATED_DISTRICTS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveDistrict(d)}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  activeDistrict.id === d.id
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Kec. {d.name} ({d.floodCount} Titik)
              </button>
            ))}
          </div>

          {/* Selected District Real Locations */}
          <div className="mt-3 border border-slate-200 bg-slate-50/60 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">
                Titik Banjir Terverifikasi — Kec. {activeDistrict.name}
              </span>
              <span className="font-mono text-[11px] font-bold text-blue-700">
                {activeDistrict.floodCount} Kejadian
              </span>
            </div>

            <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
              {activeDistrict.keyLocations.map((loc, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 size-3 shrink-0 text-slate-400" />
                  <span className="font-mono text-[11px]">{loc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sumber: BPBD Kota Bandung (2025)</span>
            <Link href="/map" className="font-semibold text-blue-700 hover:underline">
              Buka Peta Investigasi →
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Diagram: Dari Ekstraksi Fitur Spasial hingga Aksi Mitigasi */}
      <section className="border border-slate-200 bg-slate-900 text-white p-6 sm:p-8">
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Arsitektur Pipeline Sistem
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
            Alur Terpadu: Dari Citra & Vektor Spasial ke Aksi Lapangan
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            Tidak ada asumsi statis. Sistem memproses data multi-sumber heterogen secara otomatis dan menghasilkan urutan prioritas mitigasi terukur.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "Ekstraksi Multi-Sumber",
              desc: "Overpass API (OSM hidrologi & jalan), DEM SRTM 30m NASA (elevasi), dan 46 titik historis BPBD.",
              meta: "26 Fitur Geospasial",
            },
            {
              step: "02",
              title: "Normalisasi 30 Wilayah",
              desc: "Agregasi spasial berbasis batas poligon WGS84 resmi 30 kecamatan Kota Bandung.",
              meta: "GeoJSON WGS84",
            },
            {
              step: "03",
              title: "Inferensi XGBoost + XAI",
              desc: "Estimasi skor 0–100 terkalibrasi dan pembongkaran bobot faktor melalui SHAP TreeExplainer.",
              meta: "MAE < 3.0 · R² > 0.90",
            },
            {
              step: "04",
              title: "Prioritisasi Intervensi",
              desc: "Antrean terurut untuk alokasi pompa polder, kolam retensi, pengerukan sedimen, dan tanggul.",
              meta: "Rekomendasi Presisi",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="border border-slate-800 bg-slate-950/80 p-4 transition-colors hover:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-500">{item.step}</span>
                <span className="font-mono text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5">
                  {item.meta}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
