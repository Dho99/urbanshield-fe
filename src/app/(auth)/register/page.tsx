"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { ApiSleepNotice } from "@/components/auth/api-sleep-notice";
import { registerSchema, type RegisterInput } from "@/schemas";
import { useAuth } from "@/lib/auth-context";
import type { ApiError } from "@/lib/api/api-error";

const ROLES = [
  ["city_planner", "Perencana Kota (City Planner)"],
  ["disaster_response", "Manajemen Kebencanaan (BPBD)"],
  ["researcher", "Peneliti & Akademisi"],
  ["policy_analyst", "Analis Kebijakan Publik"],
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAccount, isAuthenticated, isLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    try {
      await registerAccount({ name: values.name.trim(), email: values.email.trim(), password: values.password, role: values.role });
    } catch (err) {
      const apiErr = err as ApiError;
      const formFields = ["name", "email", "password", "role"] as const;
      let attached = false;
      for (const field of formFields) {
        const message = apiErr.fields?.[field];
        if (message) {
          setError(field, { message });
          attached = true;
        }
      }
      if (!attached) {
        setServerError(err instanceof Error ? err.message : "Pendaftaran gagal. Silakan coba kembali.");
      }
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/dashboard");
  }, [isLoading, isAuthenticated, router]);

  if (!isLoading && isAuthenticated) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Waves className="size-5 text-slate-900" aria-hidden />
            <CardTitle>UrbanShield AI</CardTitle>
          </div>
          <p className="mt-1 text-sm text-slate-500">Daftar akun operasional baru</p>
        </CardHeader>
        <CardContent>
          <ApiSleepNotice className="mb-4" />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" autoComplete="name" {...register("name")} aria-invalid={!!errors.name} />
              {errors.name && <p role="alert" className="text-xs text-red-700">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Alamat Email</Label>
              <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
              {errors.email && <p role="alert" className="text-xs text-red-700">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Peran / Jabatan</Label>
              <Select id="role" {...register("role")} defaultValue="">
                <option value="" disabled>Pilih peran kewenangan Anda</option>
                {ROLES.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
              {errors.role && <p role="alert" className="text-xs text-red-700">{errors.role.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Kata Sandi</Label>
              <PasswordInput id="password" autoComplete="new-password" {...register("password")} aria-invalid={!!errors.password} />
              {errors.password && <p role="alert" className="text-xs text-red-700">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
              <PasswordInput id="confirmPassword" autoComplete="new-password" {...register("confirmPassword")} aria-invalid={!!errors.confirmPassword} />
              {errors.confirmPassword && <p role="alert" className="text-xs text-red-700">{errors.confirmPassword.message}</p>}
            </div>
            {serverError && <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{serverError}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Mendaftarkan…" : "Daftar Akun"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Sudah memiliki akun? <Link href="/login" className="font-medium text-slate-900 underline">Masuk</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
