import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Masukkan alamat email yang valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
    email: z.string().email("Masukkan alamat email yang valid"),
    role: z.enum(["city_planner", "disaster_response", "researcher", "policy_analyst"]),
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const predictionSchema = z.object({
  districtId: z.string().min(1, "Pilih salah satu kecamatan"),
  scenario: z.enum(["current", "heavy_rain_24h", "heavy_rain_72h", "drainage_failure"]),
  date: z.string().optional(),
});

export type PredictionInput = z.infer<typeof predictionSchema>;
