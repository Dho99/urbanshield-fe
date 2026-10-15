"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { RiskLayer } from "@/types";
import { Skeleton } from "@/components/ui/states";
import rawHistoricalData from "@/lib/data/historical_events.json";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined" && typeof maplibregl.setWorkerUrl === "function") {
  maplibregl.setWorkerUrl(window.location.origin + "/maplibre-gl-worker.js");
}

const floodEventsMap = rawHistoricalData as Record<string, { id: number; jenisKejadian: string }[]>;

const RISK_COLOR = {
  high: "#dc2626", // Merah alarm jelas
  medium: "#d97706", // Amber / oranye jelas
  low: "#16a34a", // Hijau jelas
} as const;

interface RiskMapProps {
  layer?: RiskLayer;
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (districtId: string) => void;
  className?: string;
}

const SOURCE_ID = "risk-districts";
const FILL_ID = "risk-fill";
const LINE_ID = "risk-line";
const SELECT_ID = "risk-select";

export function RiskMap({ layer, isLoading, selectedId, onSelect, className }: RiskMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const selectRef = useRef(onSelect);

  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    if (typeof window !== "undefined" && typeof maplibregl.setWorkerUrl === "function") {
      maplibregl.setWorkerUrl(window.location.origin + "/maplibre-gl-worker.js");
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [107.642, -6.903],
      zoom: 11.6,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(containerRef.current);

    // Call resize after layout mounts
    setTimeout(() => {
      map.resize();
    }, 250);

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 10,
    });

    map.on("load", () => {
      map.resize();
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: FILL_ID,
        type: "fill",
        source: SOURCE_ID,
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": ["case", ["boolean", ["get", "selected"], false], 0.85, 0.35],
        },
      });

      map.addLayer({
        id: LINE_ID,
        type: "line",
        source: SOURCE_ID,
        paint: {
          "line-color": "#334155",
          "line-width": 1.2,
          "line-opacity": 0.8,
        },
      });

      map.addLayer({
        id: SELECT_ID,
        type: "line",
        source: SOURCE_ID,
        filter: ["==", ["get", "selected"], true],
        paint: {
          "line-color": "#b91c1c",
          "line-width": 3.5,
          "line-dasharray": [2, 1.2],
        },
      });

      map.on("click", FILL_ID, (e) => {
        const id = e.features?.[0]?.properties?.districtId;
        if (id) selectRef.current(id);
      });

      map.on("mousemove", FILL_ID, (e) => {
        if (e.features && e.features.length > 0) {
          map.getCanvas().style.cursor = "pointer";
          const props = e.features[0].properties;
          const name = props?.district || props?.districtId || "Wilayah";
          const score = props?.score ?? "—";
          const rLevel = String(props?.riskLevel || "medium").toLowerCase();
          const levelText =
            rLevel === "high"
              ? "RISIKO TINGGI"
              : rLevel === "medium"
              ? "RISIKO SEDANG"
              : rLevel === "low"
              ? "RISIKO RENDAH"
              : rLevel.toUpperCase();

          const districtId = props?.districtId || "";
          const norm = (id?: string | null) => (id || "").toLowerCase().replace(/[\s_-]+/g, "");
          const targetNorm = norm(districtId);
          const matchedKey = Object.keys(floodEventsMap).find((k) => norm(k) === targetNorm);
          const floodCount = (matchedKey ? floodEventsMap[matchedKey]?.length : floodEventsMap[districtId]?.length) || 0;
          const floodInfo =
            floodCount > 0
              ? `<div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #1d4ed8; font-weight: 600;">${floodCount} titik banjir tercatat (BPBD 2025)</div>`
              : `<div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #64748b;">Nihil catatan banjir (BPBD 2025)</div>`;

          popup
            .setLngLat(e.lngLat)
            .setHTML(
              `<div style="font-family: inherit; font-size: 12px; padding: 2px 4px; color: #0f172a;">` +
                `<strong style="font-size: 13px;">Kecamatan ${name}</strong><br/>` +
                `<span style="color: #64748b; font-size: 11px;">Skor Risiko: </span>` +
                `<strong>${score}</strong>` +
                `<span style="margin-left: 4px; font-size: 10px; font-weight: 700; color: ${props?.color || '#0f172a'};">(${levelText})</span>` +
                floodInfo +
                `</div>`
            )
            .addTo(map);
        }
      });

      map.on("mouseleave", FILL_ID, () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });
    });

    mapRef.current = map;
    return () => {
      popup.remove();
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !layer) return;

    const norm = (id?: string | null) => (id || "").toLowerCase().replace(/[\s_-]+/g, "");
    const selNorm = norm(selectedId);

    const setData = () => {
      const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
      if (!source) return;

      source.setData({
        type: "FeatureCollection",
        features: (layer.features || []).map((f) => {
          const score = Number(f.properties?.score ?? 0);
          const rawLevel = String(f.properties?.riskLevel || "").toLowerCase();
          const rLevel: keyof typeof RISK_COLOR =
            rawLevel === "high" || score >= 70
              ? "high"
              : rawLevel === "low" || (score > 0 && score < 40)
              ? "low"
              : "medium";
          const color = RISK_COLOR[rLevel];
          const dId = f.properties?.districtId;
          return {
            ...f,
            properties: {
              ...f.properties,
              riskLevel: rLevel,
              color,
              selected: Boolean(selNorm && (norm(dId) === selNorm || norm(f.properties?.district) === selNorm)),
            },
          };
        }),
      } as GeoJSON.FeatureCollection);
    };

    if (map.getSource(SOURCE_ID)) {
      setData();
    } else {
      map.once("load", setData);
    }
  }, [layer, selectedId]);

  return (
    <div
      className={cn("relative h-full min-h-[460px] w-full overflow-hidden bg-slate-100", className)}
      role="application"
      aria-label="Peta interaktif risiko banjir"
    >
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-white/60 p-4" aria-label="Memuat peta...">
          <Skeleton className="h-full w-full" />
        </div>
      )}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2.5 border border-slate-200/90 bg-white/95 px-3 py-1.5 text-[11px] shadow-sm backdrop-blur-xs">
        <span className="font-semibold text-slate-700">Tingkat Risiko:</span>
        <span className="h-3 w-px bg-slate-200" aria-hidden />
        <LegendDot color={RISK_COLOR.high} label="Tinggi (≥70)" />
        <LegendDot color={RISK_COLOR.medium} label="Sedang (40–69)" />
        <LegendDot color={RISK_COLOR.low} label="Rendah (<40)" />
      </div>
      <div className="absolute right-3 top-3 z-10 hidden border border-slate-200 bg-white/95 px-2.5 py-1 font-mono text-[11px] text-slate-600 shadow-xs sm:block">
        Kota Bandung · 30 Kecamatan
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-slate-700">
      <span
        className="inline-block size-2.5 border border-slate-900/10"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {label}
    </span>
  );
}
