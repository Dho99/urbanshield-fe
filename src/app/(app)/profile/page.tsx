"use client";

import Link from "next/link";
import { Topbar } from "@/components/layout/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/states";
import { useSession } from "@/lib/auth-client";
import { ShieldCheck, User, Mail, Briefcase, Clock3 } from "lucide-react";

const ROLE_LABEL: Record<string, string> = {
  city_planner: "Perencana Kota (City Planner)",
  disaster_response: "Manajemen Kebencanaan (BPBD)",
  researcher: "Peneliti & Akademisi",
  policy_analyst: "Analis Kebijakan Publik",
};

const ROLE_DESC: Record<string, string> = {
  city_planner: "Perencanaan tata ruang jangka panjang & perbaikan infrastruktur · membutuhkan bukti pola kerentanan berbasis data spasial.",
  disaster_response: "Pemantauan & koordinasi mitigasi kebencanaan · membutuhkan informasi prioritas wilayah berisiko tinggi serta rencana aksi mitigasi yang jelas.",
  researcher: "Validasi hasil luaran model & pola temporal · membutuhkan transparansi bobot kontribusi fitur dan rekam jejak data.",
  policy_analyst: "Penentuan prioritas alokasi anggaran mitigasi di tengah keterbatasan sumber daya · memerlukan estimasi efektivitas dampak.",
};

export default function ProfilePage() {
  const { data, isPending } = useSession();
  const role = (data?.user as { role?: string } | undefined)?.role;

  return (
    <div className="flex min-h-full flex-col">
      <Topbar title="Profil Pengguna & Ruang Kerja" subtitle="Informasi akun, peran kewenangan, dan cakupan sistem operasional" />
      <main className="flex-1 p-4 lg:p-6">
        <div className="grid max-w-4xl gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-4 text-slate-500" aria-hidden /> Informasi Pengguna
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPending ? (
                <div className="space-y-2" aria-label="Memuat profil">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-5 w-1/3" />
                </div>
              ) : !data?.user ? (
                <p className="text-sm text-slate-500">Sesi tidak ditemukan. Silakan masuk kembali.</p>
              ) : (
                <dl className="divide-y divide-slate-200 text-sm">
                  <div className="flex items-center justify-between gap-4 py-3">
                    <dt className="flex items-center gap-2 text-slate-500">
                      <User className="size-3.5" aria-hidden /> Nama Lengkap
                    </dt>
                    <dd className="font-medium text-slate-900">{data.user.name}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <dt className="flex items-center gap-2 text-slate-500">
                      <Mail className="size-3.5" aria-hidden /> Alamat Email
                    </dt>
                    <dd className="font-mono text-sm font-medium text-slate-900">{data.user.email}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <dt className="flex items-center gap-2 text-slate-500">
                      <Briefcase className="size-3.5" aria-hidden /> Peran / Jabatan
                    </dt>
                    <dd className="font-medium text-slate-900">{role ? (ROLE_LABEL[role] ?? role) : "Belum ditentukan"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <dt className="flex items-center gap-2 text-slate-500">
                      <ShieldCheck className="size-3.5" aria-hidden /> Verifikasi Email
                    </dt>
                    <dd className="font-medium text-slate-900">{data.user.emailVerified ? "Terverifikasi" : "Belum Terverifikasi"}</dd>
                  </div>
                </dl>
              )}
              {role && ROLE_DESC[role] && (
                <p className="mt-4 border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
                  <span className="font-medium text-slate-700">Alur Kerja Anda: </span>
                  {ROLE_DESC[role]}
                </p>
              )}
              <div className="mt-4 border-t border-slate-200 pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Pengaturan Akun</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Perubahan kata sandi dan penetapan peran akun dikelola langsung oleh administrator sistem.
                </p>
                <div className="mt-3 flex gap-2">
                  <Link href="/dashboard" className="border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Kembali ke Ringkasan
                  </Link>
                  <Link href="/map" className="bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700">
                    Buka Peta Risiko
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock3 className="size-4 text-slate-500" aria-hidden /> Cakupan Sistem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="font-mono text-xs font-medium text-slate-900">Implementasi Kota Bandung</p>
                  <p className="text-xs text-slate-600">30 kecamatan resmi · poligon batas administratif WGS84 terintegrasi.</p>
                </div>
                <ul className="space-y-1 text-xs text-slate-600">
                  <li>• 4 faktor pendorong utama (curah hujan, drainase, elevasi, kepadatan)</li>
                  <li>• Skenario: kondisi saat ini · hujan 24j · hujan 72j · kegagalan drainase</li>
                  <li>• Rekomendasi mitigasi terurut berdasarkan estimasi efektivitas dampak</li>
                </ul>
                <p className="text-xs text-slate-500">Engine backend analitik spasial aktif memproses seluruh 30 kecamatan Kota Bandung.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Akses Cepat Modul</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm">
                <Link href="/dashboard" className="flex items-center justify-between border border-slate-200 px-3 py-2 hover:bg-slate-50">
                  <span>Pemantauan Harian</span> <span className="font-mono text-xs text-slate-500">/dashboard</span>
                </Link>
                <Link href="/prediction" className="flex items-center justify-between border border-slate-200 px-3 py-2 hover:bg-slate-50">
                  <span>Simulasi Prediksi</span> <span className="font-mono text-xs text-slate-500">/prediction</span>
                </Link>
                <Link href="/recommendation" className="flex items-center justify-between border border-slate-200 px-3 py-2 hover:bg-slate-50">
                  <span>Antrean Mitigasi</span> <span className="font-mono text-xs text-slate-500">/recommendation</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
