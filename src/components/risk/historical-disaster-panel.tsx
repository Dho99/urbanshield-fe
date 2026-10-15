"use client";

import { useMemo, useState } from "react";
import rawHistoricalData from "@/lib/data/historical_events.json";
import type { HistoricalDisasterEvent } from "@/types";
import {
  Droplets,
  MapPin,
  Calendar,
  Search,
  CheckCircle2,
  Info,
} from "lucide-react";

const historicalEventsMap = rawHistoricalData as Record<string, HistoricalDisasterEvent[]>;

interface HistoricalDisasterPanelProps {
  districtId: string | null;
  districtName?: string;
  apiEvents?: HistoricalDisasterEvent[];
}

export function HistoricalDisasterPanel({
  districtId,
  districtName,
  apiEvents,
}: HistoricalDisasterPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Hanya menyaring data kejadian yang secara spesifik merupakan banjir
  const floodEvents: HistoricalDisasterEvent[] = useMemo(() => {
    if (!districtId) return [];
    const norm = (id?: string | null) => (id || "").toLowerCase().replace(/[\s_-]+/g, "");
    const targetNorm = norm(districtId);
    const matchedKey = Object.keys(historicalEventsMap).find((k) => norm(k) === targetNorm);
    const sourceList =
      apiEvents && apiEvents.length > 0
        ? apiEvents
        : matchedKey
        ? historicalEventsMap[matchedKey]
        : historicalEventsMap[districtId] || [];
    return sourceList.filter((e) => e.jenisKejadian.toUpperCase().includes("BANJIR"));
  }, [districtId, apiEvents]);

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return floodEvents;
    const q = searchQuery.toLowerCase();
    return floodEvents.filter((e) => {
      const matchKel = e.kelurahan.toLowerCase().includes(q);
      const matchLok = e.lokasi.toLowerCase().includes(q);
      return matchKel || matchLok;
    });
  }, [floodEvents, searchQuery]);

  if (!districtId) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
        <MapPin className="size-8 text-slate-400" aria-hidden />
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
          Belum Ada Kecamatan Dipilih
        </p>
        <p className="mt-1 max-w-md text-xs text-slate-500">
          Klik salah satu poligon kecamatan pada peta di atas untuk menampilkan rincian titik kejadian banjir historis resmi BPBD Kota Bandung.
        </p>
      </div>
    );
  }

  const displayName = districtName || districtId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="flex flex-col border border-slate-200 bg-white">
      {/* Header Panel Khusus Banjir */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center bg-blue-600 text-white font-semibold text-xs shadow-xs">
            <Droplets className="size-3.5 text-white" aria-hidden />
          </span>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Titik Kejadian Banjir Historis — Kec. {displayName}
            </h3>
            <p className="text-[11px] text-slate-500">
              Rekapitulasi resmi kejadian genangan air & banjir lapangan (Tahun 2025)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] text-slate-600">
            <Calendar className="size-3 text-slate-400" /> Sumber: BPBD Kota Bandung
          </span>
        </div>
      </div>

      {/* Bar Ringkasan & Pencarian Jalan */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-900">
            <Droplets className="size-3.5 text-blue-700" />
            {floodEvents.length} Titik Kejadian Banjir Tercatat
          </span>
        </div>

        {/* Input Pencarian Alamat / Kelurahan */}
        {floodEvents.length > 0 && (
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari jalan atau kelurahan..."
              className="h-7 w-full border border-slate-200 bg-slate-50/60 pl-8 pr-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Konten Daftar Titik Kejadian Banjir */}
      <div className="p-3">
        {floodEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle2 className="size-6 text-emerald-600" aria-hidden />
            <p className="mt-2 text-xs font-semibold text-slate-800">
              Nihil Titik Kejadian Banjir Terdata (2025)
            </p>
            <p className="mt-1 max-w-md text-[11px] text-slate-500">
              Tidak ada catatan laporan genangan air atau banjir resmi BPBD yang tercatat di wilayah Kecamatan {displayName} pada periode tahun berjalan 2025.
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500">
            Tidak ada titik banjir yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-100 border border-slate-200 bg-white">
            {filteredEvents.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 hover:bg-blue-50/40 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 shrink-0 inline-flex items-center gap-1 bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                    <Droplets className="size-2.5 text-blue-700" />
                    BANJIR
                  </span>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">
                        Kel. {item.kelurahan}
                      </span>
                      <span className="text-[10px] text-slate-400">· ID #{item.id}</span>
                    </div>
                    <p className="flex items-center gap-1 font-mono text-[11px] text-slate-700">
                      <MapPin className="size-3 text-slate-400 shrink-0" aria-hidden />
                      {item.lokasi}
                    </p>
                  </div>
                </div>

                <div className="self-end sm:self-center shrink-0">
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5">
                    Thn {item.tahun}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Catatan Kaki Provenance */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-3 py-1.5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <Info className="size-3 text-slate-400" /> Menampilkan {filteredEvents.length} dari {floodEvents.length} titik banjir terverifikasi di Kecamatan {displayName}
        </span>
        <span className="font-mono text-[10px] text-slate-400">BPBD Kota Bandung</span>
      </div>
    </div>
  );
}
