"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { BarChart3, Map as MapIcon, FlaskConical, ClipboardList, Database, User, LogOut, Waves, ShieldAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { href: "/dashboard", label: "Ringkasan", desc: "Pemantauan harian", icon: BarChart3 },
  { href: "/map", label: "Peta Risiko", desc: "Investigasi wilayah", icon: MapIcon },
  { href: "/prediction", label: "Prediksi", desc: "Analisis skenario", icon: FlaskConical },
  { href: "/recommendation", label: "Prioritas", desc: "Antrean mitigasi", icon: ClipboardList },
  { href: "/datasets", label: "Dataset", desc: "Status sumber data", icon: Database },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleSignOut() {
    logout();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col bg-slate-900 text-slate-300 max-lg:hidden">
      <div className="shrink-0 border-b border-slate-800 px-4 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center bg-white text-slate-900">
            <Waves className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-white">UrbanShield AI</p>
            <p className="text-[11px] leading-none text-slate-400">Intelijen Risiko Banjir</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px]">
          <CheckCircle2 className="size-3 text-emerald-400" aria-hidden />
          <span className="font-medium uppercase tracking-wide text-slate-400">Sistem operasional</span>
          <span className="ml-auto font-mono text-slate-500">Kota Bandung</span>
        </div>
      </div>

      <nav aria-label="Navigasi Utama" className="flex-1 overflow-y-auto px-2 py-3">
        <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-widest text-slate-500">Ruang Kerja</p>
        <div className="space-y-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm",
                  active
                    ? "border-white bg-slate-800 text-white"
                    : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-100",
                )}
              >
                <item.icon className="size-4 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium leading-none">{item.label}</span>
                  <span className="block text-[11px] leading-none opacity-70">{item.desc}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 border-t border-slate-800 pt-4">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 text-sm",
              pathname.startsWith("/profile") ? "text-white" : "text-slate-400 hover:text-slate-200",
            )}
          >
            <User className="size-4" aria-hidden />
            Profil Pengguna
          </Link>
        </div>
      </nav>

      <div className="shrink-0 border-t border-slate-800 px-4 py-3">
        <p className="truncate font-mono text-xs text-slate-300">{user?.email ?? "Telah Masuk"}</p>
        <p className="truncate text-[11px] capitalize text-slate-500">{user?.role?.replace(/_/g, " ") ?? "Terotentikasi"}</p>
        <button onClick={handleSignOut} className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white">
          <LogOut className="size-3.5" aria-hidden /> Keluar
        </button>
      </div>
    </aside>
  );
}

export function Topbar({ title, subtitle, meta }: { title: string; subtitle?: string; meta?: string }) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-sm font-semibold tracking-tight text-slate-900">{title}</h1>
            {meta && <span className="hidden border-l border-slate-200 pl-2 font-mono text-[11px] text-slate-500 sm:inline">{meta}</span>}
          </div>
          {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 sm:inline-flex">
            <ShieldAlert className="size-3" aria-hidden /> Data Operasional — Kota Bandung
          </span>
          <nav aria-label="Navigasi Seluler" className="flex items-center gap-0.5 lg:hidden">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  className={cn("p-2", active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100")}
                >
                  <item.icon className="size-4" aria-hidden />
                </Link>
              );
            })}
            <Link href="/profile" aria-label="Profil Pengguna" className="p-2 text-slate-600 hover:bg-slate-100">
              <User className="size-4" aria-hidden />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
