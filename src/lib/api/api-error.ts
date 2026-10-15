import { AxiosError } from "axios";

export interface ApiFieldErrors {
  [field: string]: string;
}

export interface ApiError extends Error {
  status?: number;
  fields?: ApiFieldErrors;
}

interface FastApiDetailItem {
  loc?: (string | number)[];
  msg?: string;
  type?: string;
}

// Pesan backend (Inggris) -> pesan Indonesia yang jelas.
const MESSAGE_ID: Record<string, string> = {
  "Invalid credentials": "Email atau kata sandi salah.",
  "Email already registered": "Email sudah terdaftar. Silakan masuk.",
  "Not authenticated": "Sesi berakhir. Silakan masuk kembali.",
  "Authentication required": "Silakan masuk terlebih dahulu.",
};

// Pesan per-field untuk error validasi 422.
const FIELD_MESSAGE_ID: Record<string, string> = {
  email: "Masukkan alamat email yang valid.",
  password: "Kata sandi tidak valid.",
  full_name: "Nama lengkap tidak valid.",
  name: "Nama lengkap tidak valid.",
  role: "Peran tidak valid.",
  confirmPassword: "Konfirmasi kata sandi tidak cocok.",
};

function fieldFromLoc(loc: (string | number)[] | undefined): string | null {
  if (!loc || loc.length === 0) return null;
  const last = loc[loc.length - 1];
  return typeof last === "string" ? last : null;
}

function friendlyFieldMessage(field: string, fallback: string): string {
  return FIELD_MESSAGE_ID[field] ?? fallback;
}

/** Ubah error axios/FastAPI jadi Error berbahasa Indonesia, tak pernah [object Object]. */
export function toApiError(error: unknown): ApiError {
  const err = new Error("Terjadi kesalahan. Silakan coba lagi.") as ApiError;

  if (error instanceof AxiosError) {
    err.status = error.response?.status;
    const data = error.response?.data as
      | { detail?: string | FastApiDetailItem[]; message?: string }
      | undefined;

    if (!error.response) {
      err.message =
        error.code === "ECONNABORTED"
          ? "Server terlalu lama merespons. Silakan coba lagi."
          : "Server tidak terjangkau. Periksa koneksi dan alamat backend Anda.";
      return err;
    }

    const detail = data?.detail;
    if (typeof detail === "string") {
      err.message = MESSAGE_ID[detail] ?? detail;
      return err;
    }

    if (Array.isArray(detail)) {
      const fields: ApiFieldErrors = {};
      for (const item of detail) {
        const field = fieldFromLoc(item.loc);
        if (field) fields[field] = friendlyFieldMessage(field, item.msg ?? "Tidak valid.");
      }
      const keys = Object.keys(fields);
      if (keys.length > 0) {
        err.fields = fields;
        err.message = keys.length === 1 ? fields[keys[0]] : "Periksa kembali isian formulir.";
        return err;
      }
      const first = detail[0]?.msg;
      if (first) {
        err.message = first;
        return err;
      }
    }

    if (typeof data?.message === "string") {
      err.message = data.message;
      return err;
    }
    if (error.message) {
      err.message = error.message;
      return err;
    }
    return err;
  }

  if (error instanceof Error) {
    err.message = error.message;
    const withFields = error as ApiError;
    if (withFields.fields) err.fields = withFields.fields;
    if (withFields.status !== undefined) err.status = withFields.status;
  }
  return err;
}
