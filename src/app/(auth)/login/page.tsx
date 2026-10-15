"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/schemas";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    const { error } = await signIn.email({ email: values.email, password: values.password });
    if (error) {
      setServerError(error.message ?? "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Alamat Email</Label>
              <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
              {errors.email && <p role="alert" className="text-xs text-red-700">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input id="password" type="password" autoComplete="current-password" {...register("password")} aria-invalid={!!errors.password} />
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
