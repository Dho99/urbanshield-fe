import Link from "next/link";
import {
  ArrowRight,
  Map as MapIcon,
  FlaskConical,
  ClipboardList,
  Waves,
  ShieldAlert,
  Layers3,
  Droplets,
  Database,
  Building2,
  Cpu,
  CheckCircle2,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { HeroInteractiveMap } from "@/components/landing/hero-interactive-map";
import { InteractiveShowcase } from "@/components/landing/interactive-showcase";

const OPERATIONAL_ROLES = [
  {
    role: "Badan Penanggulangan Bencana (BPBD)",
    focus: "Kesiapsiagaan & Tanggap Darurat",
    output: "Pemantauan zona kritis dan respon cepat sebelum akumulasi air meluap ke permukiman warga.",
    icon: ShieldAlert,
    badge: "Operasional 24/7",
  },
  {
    role: "Perencana Kota (Bappeda)",
    focus: "Alokasi Anggaran & Retensi Air",
    output: "Penentuan titik prioritas pembangunan kolam retensi, polder pompa, dan revitalisasi drainase.",
    icon: Layers3,
    badge: "Perencanaan Strategis",
  },
  {
    role: "Dinas Sumber Daya Air & Bina Marga",
    focus: "Pemeliharaan Saluran & Kirmir",
    output: "Jadwal pengerukan sedimentasi berkala dan perbaikan tanggul kritis pada aliran sungai utama.",
    icon: Building2,
    badge: "Infrastruktur Fisik",
  },
  {
    role: "Analis Data & Tim Kewilayahan",
    focus: "Audit Kebijakan Berbasis Bukti",
    output: "Dekomposisi faktor SHAP untuk verifikasi transparansi penilaian risiko di tingkat kecamatan.",
    icon: Cpu,
    badge: "Verifikasi Ilmiah",
  },
];

const SPOTLIGHT_DISTRICTS = [
  {
    name: "Gedebage",
    slug: "gedebage",
    score: 52,
    risk: "medium",
    floodPoints: 7,
    elevation: "668 mdpl (Cekungan Timur)",
    highlight: "Komplek Bumi Adipura, Derwati & Rancanumpang",
    recommendation: "Pembangunan sistem pompa polder & perbesaran kapasitas kolam retensi.",
  },
  {
    name: "Rancasari",
    slug: "rancasari",
    score: 48,
    risk: "medium",
    floodPoints: 8,
    elevation: "672 mdpl",
    highlight: "Cisaranten Kidul, Rancasawo & Kali Cipamokolan",
    recommendation: "Normalisasi sedimentasi dan penguatan tanggul aliran Cipamokolan.",
  },
  {
    name: "Astana Anyar",
    slug: "astana-anyar",
    score: 46,
    risk: "medium",
    floodPoints: 3,
    elevation: "704 mdpl (Kepadatan Tinggi)",
    highlight: "Koridor Pagarsih, Cibadak & DAS Citepus",
    recommendation: "Perluasan gorong-gorong primer dan inlet tangkapan air jalan raya.",
  },
  {
    name: "Sukajadi",
    slug: "sukajadi",
    score: 58,
    risk: "medium",
    floodPoints: 3,
    elevation: "732 mdpl",
    highlight: "Gg. Sukabekti, Sukabungah & Pasteur",
    recommendation: "Pembuatan sumur resapan komunal dan penataan aliran limpasan lereng.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center bg-slate-900 text-white shadow-xs">
              <Waves className="size-4" aria-hidden />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-slate-900">
                  UrbanShield AI
                </span>
                <span className="border border-slate-200 bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-slate-700">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] leading-none text-slate-500">
                Intelijen Risiko Banjir Perkotaan · Pilot 30 Kecamatan Kota Bandung
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 sm:flex">
              <CheckCircle2 className="size-3.5 text-emerald-600" aria-hidden />
              <span className="font-medium text-[11px]">Model Siap: 30 Kecamatan Aktif</span>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-slate-800"
            >
              <span>Masuk Aplikasi</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-12 px-4 py-8 sm:px-6 sm:py-12">
        {/* HERO SECTION */}
        <section className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Kolom Kiri: Ringkasan Nilai & KPI */}
          <div className="space-y-5 lg:col-span-6">
            <div className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700">
              <span className="size-1.5 bg-blue-600" />
              Sistem Geospasial Berbasis Explainable AI (XAI)
            </div>

            <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              Prediksi Risiko Banjir Kota Bandung Berbasis Machine Learning & Validasi Lapangan
            </h1>

            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Mengintegrasikan <strong>26 variabel geospasial</strong> dari jaringan hidrologi OpenStreetMap dan morfometri elevasi DEM SRTM 30m, serta divalidasi langsung terhadap <strong>46 titik kejadian banjir resmi BPBD Kota Bandung</strong> (2025).
            </p>

            {/* Aksi Cepat */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-slate-800"
              >
                <span>Buka Dasbor Ringkasan</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-900 shadow-xs transition-colors hover:bg-slate-50"
              >
                <MapIcon className="size-3.5 text-slate-600" />
                <span>Peta Spasial Investigasi</span>
              </Link>
            </div>

            {/* 4 Kartu Metrik Utama */}
            <div className="grid grid-cols-2 gap-2 border border-slate-200 bg-white p-3 sm:grid-cols-4">
              <div className="border-r border-slate-100 pr-2 last:border-r-0">
                <span className="font-mono text-xl font-bold tracking-tight text-slate-900">30</span>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Kecamatan</p>
                <p className="text-[10px] text-slate-400">Poligon WGS84</p>
              </div>
              <div className="border-r border-slate-100 pr-2 last:border-r-0">
                <span className="font-mono text-xl font-bold tracking-tight text-blue-700">46</span>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Titik Banjir</p>
                <p className="text-[10px] text-slate-400">BPBD 2025</p>
              </div>
              <div className="border-r border-slate-100 pr-2 last:border-r-0">
                <span className="font-mono text-xl font-bold tracking-tight text-slate-900">26</span>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Fitur Spasial</p>
                <p className="text-[10px] text-slate-400">OSM & SRTM 30m</p>
              </div>
              <div>
                <span className="font-mono text-xl font-bold tracking-tight text-emerald-700">SHAP</span>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Explainable</p>
                <p className="text-[10px] text-slate-400">Bukan Black-Box</p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Peta Interaktif Hero Langsung */}
          <div className="lg:col-span-6">
            <HeroInteractiveMap />
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE SHOWCASE (Simulasi Multi-Skenario, XAI SHAP, Validasi BPBD & Pipeline) */}
        <InteractiveShowcase />

        {/* SECTION 3: SPOTLIGHT WILAYAH CEKUNGAN KRITIS KOTA BANDUNG */}
        <section className="border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Kajian Spasial Kewilayahan
              </p>
              <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                Fokus Cekungan & Koridor Risiko Utama Kota Bandung
              </h2>
            </div>
            <Link
              href="/map"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              <span>Telusuri 30 Kecamatan di Peta</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">
            {SPOTLIGHT_DISTRICTS.map((d) => (
              <div key={d.slug} className="flex flex-col justify-between p-4 sm:p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Kec. {d.name}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      Skor {d.score}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                    <Droplets className="size-3 text-blue-600" />
                    <span>{d.floodPoints} Titik Banjir Resmi BPBD</span>
                  </div>

                  <p className="mt-2 text-[11px] font-mono text-slate-500">
                    {d.elevation}
                  </p>

                  <div className="mt-3 border-t border-slate-100 pt-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Wilayah Terdampak:
                    </p>
                    <p className="mt-0.5 text-xs text-slate-700 leading-snug">
                      {d.highlight}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Rekomendasi Utama:
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                    {d.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: INTEGRASI PERAN OPERASIONAL PEMERINTAH */}
        <section className="border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Kesesuaian Pengguna
            </p>
            <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              Dirancang untuk Kolaborasi Lintas Dinas & Pengambil Kebijakan
            </h2>
          </div>

          <div className="grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">
            {OPERATIONAL_ROLES.map((r) => (
              <div key={r.role} className="flex flex-col justify-between p-4 sm:p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <r.icon className="size-5 text-slate-800" aria-hidden />
                    <span className="border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-600">
                      {r.badge}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">{r.role}</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-700">{r.focus}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{r.output}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: CALL TO ACTION BANNER */}
        <section className="border border-slate-900 bg-slate-900 p-6 sm:p-10 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <span className="inline-flex items-center gap-1.5 border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                <CheckCircle2 className="size-3.5 text-emerald-400" /> Kesiapsiagaan Cerdas Berbasis Data
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Akses Platform Intelijen Geospasial Risiko Banjir Kota Bandung
              </h2>
              <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                Pantau status risiko harian 30 kecamatan, simulasikan beban skenario hidrologis, dan unduh antrean prioritas mitigasi terstruktur untuk perencanaan wilayah.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-white px-5 py-2.5 text-xs font-bold text-slate-900 shadow-sm transition-colors hover:bg-slate-100"
              >
                <span>Buka Dasbor Ringkasan</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/recommendation"
                className="inline-flex items-center gap-2 border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
              >
                <ClipboardList className="size-3.5" />
                <span>Antrean Prioritas Mitigasi</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-5 text-xs text-slate-500 sm:px-6">
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">UrbanShield AI — Sistem Intelijen Risiko Banjir Perkotaan</p>
            <p className="text-[11px]">
              Pilot Implementasi Wilayah Kota Bandung · Fusi Data OpenStreetMap, DEM SRTM 30m, dan Rekapitulasi BPBD Kota Bandung.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-400">
            <span>Next.js 16</span>
            <span>·</span>
            <span>MapLibre GL</span>
            <span>·</span>
            <span>XGBoost Regressor</span>
            <span>·</span>
            <span>SHAP TreeExplainer</span>
            <span>·</span>
            <span>FastAPI + PostGIS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
