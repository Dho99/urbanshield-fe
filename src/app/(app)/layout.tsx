"use client";

import { useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";
import { Sidebar, Topbar } from "@/components/layout/nav";
import { useAuth } from "@/lib/auth-context";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">Memuat sesi…</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="lg:hidden">
          <Topbar title="UrbanShield AI" />
        </div>
        {children}
      </div>
    </div>
  );
}
