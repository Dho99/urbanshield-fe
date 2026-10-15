"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Search, ListOrdered, Filter, Download, BrainCircuit } from "lucide-react";
import { Topbar } from "@/components/layout/nav";
import { DataProvenanceStrip, RiskBadge } from "@/components/risk/risk-panels";
import { DecisionDialog } from "@/components/risk/decision-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRecommendationDecision, useRecommendations } from "@/hooks/queries";
import type { RecommendationAction, RiskLevel } from "@/types";

type SortKey = "priority" | "area" | "risk";
type SortDir = "asc" | "desc";

const RISK_ORDER: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };

export default function RecommendationPage() {
  const { data, isPending, isError, error, refetch } = useRecommendations();
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | RiskLevel>("all");
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const decision = useRecommendationDecision(selectedAreaId);

  const rows = useMemo(() => {
    const list = data ?? [];
    const filtered = list.filter(
      (r) =>
        (riskFilter === "all" || r.risk === riskFilter) &&
        r.area.toLowerCase().includes(query.trim().toLowerCase()),
    );
    return [...filtered].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "area") return a.area.localeCompare(b.area) * dir;
      if (sortKey === "risk") return (RISK_ORDER[a.risk] - RISK_ORDER[b.risk]) * dir;
      return (a.priority - b.priority) * dir;
    });
  }, [data, query, riskFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <Topbar
        title="Prioritas Mitigasi"
        subtitle="Daftar tindakan terurut berdasarkan risiko wilayah dan estimasi dampak — tentukan prioritas alokasi sumber daya"
        meta={data ? `${rows.length} dari ${data.length} tindakan` : undefined}
      />
      <main className="flex-1 space-y-4 p-4 lg:p-6">
        <div className="grid gap-3 border border-slate-200 bg-white p-3 md:grid-cols-12 md:items-end">
          <div className="space-y-1.5 md:col-span-6">
            <Label htmlFor="search" className="flex items-center gap-1">
              <Search className="size-3 text-slate-400" aria-hidden /> Cari wilayah
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-slate-400" aria-hidden />
              <Input id="search" placeholder="contoh: Coblong" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
            </div>
          </div>
          <div className="space-y-1.5 md:col-span-3">
            <Label htmlFor="riskFilter" className="flex items-center gap-1">
              <Filter className="size-3 text-slate-400" aria-hidden /> Filter berdasarkan risiko
            </Label>
            <Select id="riskFilter" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value as typeof riskFilter)}>
              <option value="all">Semua Tingkat</option>
              <option value="high">Tinggi</option>
              <option value="medium">Sedang</option>
              <option value="low">Rendah</option>
            </Select>
          </div>
          <div className="flex gap-2 md:col-span-3 md:justify-end">
            <span className="inline-flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600">
              <ListOrdered className="size-3" aria-hidden /> Urutan: {sortKey === "priority" ? "Prioritas" : sortKey === "area" ? "Wilayah" : "Risiko"} {sortDir === "asc" ? "↑" : "↓"}
            </span>
            <button
              type="button"
              onClick={() => {
                const header = "wilayah,risiko,prioritas,rencana_aksi,estimasi_dampak\n";
                const csv = rows.map((r) => `${r.area},${r.risk},${r.priority},"${r.action}",${r.estimatedImpact}`).join("\n");
                const blob = new Blob([header + csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "urbanshield-prioritas-mitigasi.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="size-3" aria-hidden /> Ekspor CSV
            </button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Antrean Prioritas Tindakan</CardTitle>
            <span className="font-mono text-[11px] text-slate-500">Prioritas 1 = tangani terlebih dahulu · Estimasi Dampak: Tinggi / Sedang / Rendah</span>
          </CardHeader>
          <CardContent>
            {isPending && (
              <div className="space-y-2" aria-label="Memuat rekomendasi">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </div>
            )}
            {isError && <ErrorState message={(error as Error).message} onRetry={() => refetch()} />}
            {!isPending && !isError && rows.length === 0 && (
              <EmptyState title="Tidak ada tindakan yang cocok" description="Sesuaikan kata kunci pencarian atau filter tingkat risiko untuk melihat rekomendasi tindakan mitigasi." />
            )}
            {!isPending && !isError && rows.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <SortHead label="Wilayah" k="area" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHead label="Risiko" k="risk" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHead label="Prioritas" k="priority" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <TableHead>Rencana Aksi Mitigasi</TableHead>
                    <TableHead>Estimasi Dampak</TableHead>
                    <TableHead>
                      <span className="uppercase">Keputusan AI</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r: RecommendationAction) => (
                    <TableRow key={r.areaId}>
                      <TableCell className="font-medium text-slate-900">{r.area}</TableCell>
                      <TableCell>
                        <RiskBadge level={r.risk} />
                      </TableCell>
                      <TableCell className="font-mono tabular-nums">#{r.priority}</TableCell>
                      <TableCell className="max-w-[28ch]">{r.action}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex border px-2 py-0.5 text-xs font-medium ${
                            r.estimatedImpact === "High"
                              ? "border-red-200 bg-red-50 text-red-800"
                              : r.estimatedImpact === "Medium"
                                ? "border-amber-200 bg-amber-50 text-amber-800"
                                : "border-slate-200 bg-slate-50 text-slate-700"
                          }`}
                        >
                          {r.estimatedImpact === "High" ? "Tinggi" : r.estimatedImpact === "Medium" ? "Sedang" : "Rendah"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => setSelectedAreaId(r.areaId)}
                          className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          aria-label={`Lihat alasan keputusan AI untuk ${r.area}`}
                        >
                          <BrainCircuit className="size-3.5" aria-hidden /> Alasan AI
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Rekomendasi tindakan bersifat terstruktur dan dapat diaudit. Klik <strong>Alasan AI</strong> pada baris mana pun untuk melihat rantai keputusan: ringkasan risiko → alasan berbasis SHAP → data pendukung → tindakan mitigasi.
            </p>
          </CardContent>
        </Card>

        <DecisionDialog
          decision={selectedAreaId ? (decision.data ?? null) : null}
          isPending={selectedAreaId !== null && decision.isPending}
          onClose={() => setSelectedAreaId(null)}
        />
        <DataProvenanceStrip />
      </main>
    </div>
  );
}

function SortHead({
  label,
  k,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  k: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  const active = sortKey === k;
  return (
    <TableHead>
      <button
        onClick={() => onSort(k)}
        aria-label={`Sort by ${label.toLowerCase()} ${active && sortDir === "asc" ? "descending" : "ascending"}`}
        className="flex items-center gap-1 uppercase"
      >
        {label}
        {active && (sortDir === "asc" ? <ArrowUp className="size-3" aria-hidden /> : <ArrowDown className="size-3" aria-hidden />)}
      </button>
    </TableHead>
  );
}
