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
import { ApiSleepNotice } from "@/components/auth/api-sleep-notice";
import { loginSchema, type LoginInput } from "@/schemas";
import { useAuth } from "@/lib/auth-context";
import type { ApiError } from "@/lib/api/api-error";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    try {
      await login(values.email.trim(), values.password);
    } catch (err) {
      const apiErr = err as ApiError;
      let attached = false;
      if (apiErr.fields?.email) {
        setError("email", { message: apiErr.fields.email });
        attached = true;
      }
      if (apiErr.fields?.password) {
        setError("password", { message: apiErr.fields.password });
        attached = true;
      }
      if (!attached) {
        setServerError(err instanceof Error ? err.message : "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
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
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Waves className="size-5 text-slate-900" aria-hidden />
            <CardTitle>UrbanShield AI</CardTitle>
          </div>
          <p className="mt-1 text-sm text-slate-500">Masuk ke platform inteligensi risiko banjir</p>
        </CardHeader>
        <CardContent>
          <ApiSleepNotice className="mb-4" />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Alamat Email</Label>
              <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
              {errors.email && <p role="alert" className="text-xs text-red-700">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Kata Sandi</Label>
              <PasswordInput id="password" autoComplete="current-password" {...register("password")} aria-invalid={!!errors.password} />
              {errors.password && <p role="alert" className="text-xs text-red-700">{errors.password.message}</p>}
            </div>
            {serverError && <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{serverError}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Memproses…" : "Masuk"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Belum memiliki akun? <Link href="/register" className="font-medium text-slate-900 underline">Daftar sekarang</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
