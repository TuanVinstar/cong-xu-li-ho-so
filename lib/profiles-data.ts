import {
  studentProfiles as mockProfiles,
  type StudentProfile,
  type DocStatus,
} from "@/lib/mock-data";
import { getSupabaseServerClient } from "@/lib/supabase";

// Đọc hồ sơ học viên. Đọc từ Supabase nếu có cấu hình; nếu không / lỗi / rỗng → dùng mock.
export async function getStudentProfiles(): Promise<StudentProfile[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return mockProfiles;

  const { data, error } = await supabase
    .from("student_profiles")
    .select(
      "id, student_name, email, submitted_at, doc_transcript, doc_ielts, doc_identity, matched_schools, total_schools",
    )
    .order("id");

  if (error) {
    console.error("Lỗi đọc bảng student_profiles từ Supabase:", error.message);
    return mockProfiles;
  }

  if (!data || data.length === 0) return mockProfiles;

  return data.map((row) => ({
    id: String(row.id),
    studentName: row.student_name as string,
    email: (row.email as string) ?? "",
    submittedAt: row.submitted_at as string,
    docs: {
      transcript: row.doc_transcript as DocStatus,
      ielts: row.doc_ielts as DocStatus,
      identity: row.doc_identity as DocStatus,
    },
    matchedSchools: Number(row.matched_schools),
    totalSchools: Number(row.total_schools),
  }));
}
