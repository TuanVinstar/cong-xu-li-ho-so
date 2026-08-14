import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildChatSystemInstruction } from "@/lib/chatbot-qna";

const MODEL = "gemini-3.5-flash-lite";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server chưa cấu hình GEMINI_API_KEY." },
      { status: 500 },
    );
  }

  let message = "";
  try {
    const body = await request.json();
    message = typeof body?.message === "string" ? body.message.trim() : "";
  } catch {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "Câu hỏi không được để trống." }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: message,
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
