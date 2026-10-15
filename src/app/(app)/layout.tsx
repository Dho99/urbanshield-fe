"use client";

import { useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";
import { Sidebar, Topbar } from "@/components/layout/nav";
import { Skeleton } from "@/components/ui/states";
import { useAuth } from "@/lib/auth-context";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-slate-100" aria-busy="true" aria-label="Memuat sesi">
        <aside className="hidden w-60 shrink-0 flex-col bg-slate-900 p-4 lg:flex">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-8 bg-slate-700" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28 bg-slate-700" />
              <Skeleton className="h-2.5 w-20 bg-slate-800" />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full bg-slate-800" />
            ))}
          </div>
        </aside>
        <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
          <div className="border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="mt-2 h-3 w-72" />
          </div>
          <main className="flex-1 space-y-6 p-4 lg:p-6">
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-6 xl:grid-cols-12">
              <Skeleton className="h-72 w-full xl:col-span-8" />
              <Skeleton className="h-72 w-full xl:col-span-4" />
            </div>
          </main>
        </div>
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
