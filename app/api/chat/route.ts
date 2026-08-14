import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildChatSystemInstruction } from "@/lib/chatbot-qna";

const MODEL = "gemini-3.5-flash-lite";

interface ChatTurn {
  from: "user" | "bot";
  text: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server chưa cấu hình GEMINI_API_KEY." },
      { status: 500 },
    );
  }

  let turns: ChatTurn[] = [];
  try {
    const body = await request.json();
    turns = Array.isArray(body?.messages)
      ? body.messages.filter(
          (m: unknown): m is ChatTurn =>
            !!m &&
            typeof m === "object" &&
            (m as ChatTurn).from !== undefined &&
            ["user", "bot"].includes((m as ChatTurn).from) &&
            typeof (m as ChatTurn).text === "string" &&
            (m as ChatTurn).text.trim().length > 0,
        )
      : [];
  } catch {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });
  }

  // Lịch sử phải bắt đầu bằng lượt của người dùng — bỏ lời chào tĩnh mở đầu (nếu có).
  while (turns.length && turns[0].from === "bot") {
    turns = turns.slice(1);
  }

  if (!turns.length) {
    return NextResponse.json({ error: "Câu hỏi không được để trống." }, { status: 400 });
  }

  const contents = turns.map((turn) => ({
    role: turn.from === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: turn.text.trim() }],
  }));

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: buildChatSystemInstruction(),
      },
    });

    const reply = response.text?.trim();
    if (!reply) {
      throw new Error("Gemini trả về nội dung rỗng");
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Lỗi gọi Gemini API:", error);
    return NextResponse.json(
      { error: "Xin lỗi, hệ thống đang gặp sự cố. Bạn thử lại sau ít phút nhé." },
      { status: 502 },
    );
  }
}
