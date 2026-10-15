"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RiskBadge, RISK_COLOR, RISK_LABEL } from "@/components/risk/risk-panels";
import { Skeleton } from "@/components/ui/states";
import type { MitigationDecision } from "@/types";

const ACTION_STYLE: Record<string, string> = {
  High: "border-red-200 bg-red-50 text-red-800",
  Medium: "border-amber-200 bg-amber-50 text-amber-800",
  Low: "border-slate-200 bg-slate-50 text-slate-700",
};

interface Props {
  decision: MitigationDecision | null;
  isPending: boolean;
  onClose: () => void;
}

export function DecisionDialog({ decision, isPending, onClose }: Props) {
  const rs = decision?.risk_summary;
  return (
    <Dialog open={decision !== null || isPending} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>AI Mitigation Decision Support</DialogTitle>
          <DialogDescription>Rantai keputusan: data → prediksi model → penjelasan SHAP → tindakan mitigasi.</DialogDescription>
        </DialogHeader>
        {isPending && !decision && (
          <div className="space-y-2" aria-label="Memuat keputusan AI">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        {decision && rs && (
          <div className="space-y-4 text-sm">
            <section className="border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">1 · Risk Summary</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="font-medium text-slate-900">Kecamatan {rs.district}</span>
                <span className="font-mono tabular-nums text-slate-900">
                  Skor <strong>{rs.score}/100</strong>
                </span>
                <RiskBadge level={rs.level} />
                <span className="ml-auto font-mono text-xs tabular-nums text-slate-600">{rs.confidence}% keyakinan</span>
              </div>
            </section>

            <section>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">2 · Why This Action?</p>
              <ol className="mt-1.5 space-y-1.5">
                {decision.why_this_action.map((w, i) => (
                  <li key={w.factor} className="border border-slate-200 bg-white px-3 py-2">
                    <p className="font-medium text-slate-900">
                      {i + 1}. {w.factor} <span className="font-mono text-xs tabular-nums text-slate-600">(+{w.contribution}%)</span>
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-600">{w.reason}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">3 · Supporting Data</p>
              <div className="mt-1.5 overflow-x-auto border border-slate-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <th className="px-2.5 py-1.5 font-medium">Faktor</th>
                      <th className="px-2.5 py-1.5 font-medium">Nilai</th>
                      <th className="px-2.5 py-1.5 text-right font-medium">Kontribusi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {decision.supporting_data.map((s) => (
                      <tr key={s.factor}>
                        <td className="px-2.5 py-1.5 text-slate-800">{s.factor}</td>
                        <td className="px-2.5 py-1.5 font-mono tabular-nums text-slate-600">{s.value}</td>
                        <td className="px-2.5 py-1.5 text-right font-mono tabular-nums text-slate-900">+{s.contribution}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">4 · AI Mitigation Recommendation</p>
              <div className="mt-1.5 space-y-1.5">
                {decision.actions.map((a, i) => (
                  <div key={a.title} className="border border-slate-200 bg-white px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-slate-900">
                        {i + 1}. {a.title}
                      </p>
                      <span className={`shrink-0 border px-2 py-0.5 text-[11px] font-medium ${ACTION_STYLE[a.priority] ?? ACTION_STYLE.Low}`}>
                        {a.priority === "High" ? "Tinggi" : a.priority === "Medium" ? "Sedang" : "Rendah"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-5 text-slate-600">{a.reason}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 border-l-2 bg-slate-50 px-3 py-1.5 text-[11px] leading-5 text-slate-500" style={{ borderColor: RISK_COLOR[rs.level] }}>
                {RISK_LABEL[rs.level]} · Urutan tindakan mengikuti prioritas engine berbasis kontribusi SHAP.
              </p>
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
