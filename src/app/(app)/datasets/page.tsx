"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useDatasets } from "@/hooks/queries";
import { Database, Filter } from "lucide-react";

const SOURCES = ["all", "OSM", "BNPB", "BMKG", "BPS", "DEM"] as const;

export default function DatasetsPage() {
  const [source, setSource] = useState<string>("all");
  const { data, isPending, isError, error, refetch } = useDatasets(source === "all" ? undefined : source);

  return (
    <div className="flex min-h-full flex-col">
      <Topbar title="Katalog & Monitoring Dataset" subtitle="Status sumber data, kebaruan, dan kelengkapan catatan spasial" meta={data ? `${data.length} dataset` : undefined} />
      <main className="flex-1 space-y-4 p-4 lg:p-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Database className="size-4 text-slate-500" aria-hidden /> Sumber Data
            </CardTitle>
            <span className="hidden font-mono text-[11px] text-slate-500 sm:inline">GET /datasets{source !== "all" ? `?source=${source}` : ""}</span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="source" className="flex items-center gap-1">
                  <Filter className="size-3 text-slate-400" aria-hidden /> Filter berdasarkan sumber
                </Label>
                <Select id="source" value={source} onChange={(e) => setSource(e.target.value)}>
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s === "all" ? "Semua Sumber" : s}
                    </option>
                  ))}
                </Select>
              </div>
              <p className="pb-2 text-xs text-slate-500">Sumber: OSM · BNPB · BMKG · BPS · DEM — kelengkapan dan pembaruan terakhir per dataset.</p>
            </div>

            {isPending && (
              <div className="space-y-2" aria-label="Memuat dataset">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            )}
            {isError && <ErrorState message={(error as Error).message} onRetry={() => refetch()} />}
            {!isPending && !isError && (!data || data.length === 0) && (
              <EmptyState title="Tidak ada dataset" description="Tidak ada dataset yang ditemukan untuk filter yang dipilih." />
            )}
            {!isPending && !isError && data && data.length > 0 && (
              <div className="overflow-x-auto border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Nama Dataset</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Sumber</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Kelengkapan</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Jumlah Catatan</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Pembaruan Terakhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {data.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2">
                          <span className="font-medium text-slate-900">{d.name}</span>
                          {d.description && <span className="block text-xs text-slate-500">{d.description}</span>}
                        </td>
                        <td className="px-3 py-2">
                          <span className="border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">{d.source}</span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-slate-200">
                              <div className="h-full bg-slate-900" style={{ width: `${Math.round((d.completeness ?? 0) * 100)}%` }} />
                            </div>
                            <span className="font-mono text-xs tabular-nums text-slate-700">{Math.round((d.completeness ?? 0) * 100)}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 font-mono tabular-nums text-slate-700">{d.record_count ?? "—"}</td>
                        <td className="px-3 py-2 font-mono text-xs text-slate-500">{d.last_update ? new Date(d.last_update).toLocaleString("id-ID") : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600">
          <span className="font-medium uppercase tracking-wide text-slate-500">Data & model</span>
          <span className="hidden text-slate-300 sm:inline">—</span>
          <span>Data terhubung langsung dari endpoint backend. Cache layer 60 detik untuk efisiensi komputasi.</span>
        </div>
      </main>
    </div>
  );
}
