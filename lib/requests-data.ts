import { admissionRequests as mockRequests, type AdmissionRequest } from "@/lib/mock-data";
import { getSupabaseServerClient } from "@/lib/supabase";

// Đọc danh sách yêu cầu báo giá. Đọc từ Supabase nếu có cấu hình; nếu không / lỗi / rỗng → dùng mock.
export async function getRequests(): Promise<AdmissionRequest[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return mockRequests;

  const { data, error } = await supabase
    .from("requests")
    .select("id, customer_name, package, quote, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Lỗi đọc bảng requests từ Supabase:", error.message);
    return mockRequests;
  }

  if (!data || data.length === 0) return mockRequests;

  return data.map((row) => ({
    id: String(row.id),
    customerName: row.customer_name as string,
    package: row.package as AdmissionRequest["package"],
    quote: Number(row.quote),
    status: row.status as AdmissionRequest["status"],
    createdAt: row.created_at as string,
  }));
}
