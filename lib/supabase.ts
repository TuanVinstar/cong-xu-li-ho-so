import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Client Supabase dùng ở phía server (Server Components, Route Handlers).
// Trả về null nếu chưa cấu hình biến môi trường — để app vẫn chạy được bằng dữ liệu mock.
let cached: SupabaseClient | null | undefined;

export function getSupabaseServerClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    cached = null;
    return cached;
  }

  cached = createClient(url, anonKey);
  return cached;
}
