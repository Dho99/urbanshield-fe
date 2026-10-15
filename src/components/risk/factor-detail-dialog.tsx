"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { FactorContribution } from "@/types";
import { interpretFactor } from "@/lib/factor-interpretation";

interface Props {
  factor: FactorContribution | null;
  onClose: () => void;
}

export function FactorDetailDialog({ factor, onClose }: Props) {
  return (
    <Dialog open={factor !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {factor && (
          <>
            <DialogHeader>
              <DialogTitle>Detail Faktor Risiko</DialogTitle>
              <DialogDescription>Penjelasan kontribusi model (SHAP) untuk faktor ini.</DialogDescription>
            </DialogHeader>
            <dl className="space-y-3 text-sm">
              <div className="border border-slate-200 bg-slate-50 px-3 py-2">
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Faktor</dt>
                <dd className="mt-0.5 font-medium text-slate-900">{factor.factor}</dd>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-200 bg-white px-3 py-2">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Kontribusi</dt>
                  <dd className="mt-0.5 font-mono text-xl font-semibold tabular-nums text-slate-900">+{factor.contribution}%</dd>
                  <div className="mt-1.5 h-1.5 bg-slate-200">
                    <div className="h-full bg-slate-900" style={{ width: `${Math.min(100, factor.contribution)}%` }} />
                  </div>
                </div>
                <div className="border border-slate-200 bg-white px-3 py-2">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Nilai Teramati</dt>
                  <dd className="mt-0.5 font-mono text-xl font-semibold tabular-nums text-slate-900">{factor.value}</dd>
                </div>
              </div>
              <div className="border-l-2 border-slate-900 bg-slate-50 px-3 py-2">
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Interpretasi</dt>
                <dd className="mt-0.5 text-sm leading-6 text-slate-800">{interpretFactor(factor.factor, factor.value)}</dd>
              </div>
            </dl>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
