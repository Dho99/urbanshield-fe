import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function ApiSleepNotice({ className }: { className?: string }) {
  return (
    <div
      role="note"
      aria-label="Informasi mode hemat daya AI"
      className={cn("flex gap-2 border border-slate-200 bg-slate-50 px-3 py-2.5", className)}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-slate-500" aria-hidden />
      <div className="text-xs leading-relaxed text-slate-600">
        <p className="font-medium text-slate-900">Mode Hemat Daya AI</p>
        <p className="mt-1">
          Model AI kami masuk mode tidur saat tidak digunakan. Jika muncul kendala API tidak merespons, mohon tunggu
          sekitar <span className="font-medium text-slate-700">1–3 menit</span> hingga model selesai dimuat dan koneksi
          API pulih kembali, lalu coba lagi secara berkala. Terima kasih atas pengertiannya.
        </p>
      </div>
    </div>
  );
}
