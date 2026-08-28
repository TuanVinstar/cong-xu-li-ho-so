import { AdminPageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getConversations } from "@/lib/conversations-data";

// Luôn render động theo từng request để dữ liệu luôn khớp Supabase (không prerender tĩnh lúc build).
export const dynamic = "force-dynamic";

export default async function AdminConversationsPage() {
  const conversations = await getConversations();

  return (
    <>
      <AdminPageHeader
        title="Hội thoại"
        description="Lịch sử hội thoại của khách với chatbot hỏi đáp trên trang chủ."
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kênh</TableHead>
              <TableHead>Số tin nhắn</TableHead>
              <TableHead>Thời gian bắt đầu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conversations.map((conv) => (
              <TableRow key={conv.id}>
                <TableCell className="font-medium">{conv.channel}</TableCell>
                <TableCell>{conv.messageCount} tin nhắn</TableCell>
                <TableCell className="text-muted-foreground">{conv.startedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
