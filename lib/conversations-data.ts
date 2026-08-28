import { conversations as mockConversations, type Conversation } from "@/lib/mock-data";
import { getSupabaseServerClient } from "@/lib/supabase";

// Đọc lịch sử hội thoại (danh sách). Đọc từ Supabase nếu có cấu hình; nếu không / lỗi / rỗng → dùng mock.
// Lưu ý: chi tiết từng tin nhắn (messages) chưa migrate vì chưa có màn hình nào hiển thị — trang danh sách
// chỉ cần channel, số tin nhắn và thời gian bắt đầu.
export async function getConversations(): Promise<Conversation[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return mockConversations;

  const { data, error } = await supabase
    .from("conversations")
    .select("id, channel, message_count, started_at")
    .order("started_at", { ascending: false });

  if (error) {
    console.error("Lỗi đọc bảng conversations từ Supabase:", error.message);
    return mockConversations;
  }

  if (!data || data.length === 0) return mockConversations;

  return data.map((row) => ({
    id: String(row.id),
    channel: row.channel as Conversation["channel"],
    messageCount: Number(row.message_count),
    startedAt: row.started_at as string,
    messages: [],
  }));
}
