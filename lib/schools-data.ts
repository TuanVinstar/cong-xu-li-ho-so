import { schools as mockSchools, type School } from "@/lib/mock-data";
import { getSupabaseServerClient } from "@/lib/supabase";

// Đọc danh sách trường tham chiếu.
// - Nếu đã cấu hình Supabase và bảng `schools` có dữ liệu → lấy từ Supabase.
// - Nếu chưa cấu hình, lỗi kết nối, hoặc bảng rỗng → tự động dùng dữ liệu mock để app không vỡ.
export async function getSchools(): Promise<School[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return mockSchools;

  const { data, error } = await supabase
    .from("schools")
    .select("id, name, country, min_gpa, min_ielts")
    .order("name");

  if (error) {
    console.error("Lỗi đọc bảng schools từ Supabase:", error.message);
    return mockSchools;
  }

  if (!data || data.length === 0) return mockSchools;

  return data.map((row) => ({
    id: String(row.id),
    name: row.name as string,
    country: row.country as string,
    minGpa: Number(row.min_gpa),
    minIelts: Number(row.min_ielts),
  }));
}
