"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FactorContribution, RiskLevel } from "@/types";
import { RISK_COLOR } from "@/components/risk/risk-panels";

const BAR_COLOR: Record<RiskLevel, string> = {
  high: RISK_COLOR.high,
  medium: RISK_COLOR.medium,
  low: RISK_COLOR.low,
};

export function FactorChart({
  factors,
  riskLevel,
  onSelectFactor,
}: {
  factors: FactorContribution[];
  riskLevel: RiskLevel;
  onSelectFactor?: (factor: FactorContribution) => void;
}) {
  const data = [...factors].sort((a, b) => b.contribution - a.contribution);
  return (
    <figure className="border border-slate-200 bg-white">
      <figcaption className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-600">Kontribusi Fitur — Model Analisis Risiko</span>
        <span className="font-mono text-[11px] text-slate-500">Total kontribusi 100%</span>
      </figcaption>
      <div className="h-64 w-full px-2 py-2" role="img" aria-label="Grafik batang kontribusi fitur terhadap skor risiko">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" domain={[0, 40]} tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }} tickFormatter={(v: number) => `+${v}%`} />
            <YAxis type="category" dataKey="factor" width={128} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value, _name, props) => [`+${value}% — ${props?.payload?.value}`, "Kontribusi"]}
              contentStyle={{ fontSize: 12, borderRadius: 0, border: "1px solid #e2e8f0" }}
            />
            <Bar
              dataKey="contribution"
              radius={0}
              onClick={(d) => {
                const p = (d as unknown as { payload?: FactorContribution })?.payload;
                if (p && onSelectFactor) onSelectFactor(p);
              }}
              className={onSelectFactor ? "cursor-pointer" : undefined}
            >
              {data.map((d) => (
                <Cell key={d.factor} fill={BAR_COLOR[riskLevel]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-500">
        Diurutkan berdasarkan kontribusi terbesar. Warna menunjukkan tingkat risiko saat inferensi. Nilai mentah tertera pada tooltip dan rincian faktor.
      </p>
    </figure>
  );
}
