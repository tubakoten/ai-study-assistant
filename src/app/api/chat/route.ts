import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `Sen bir çalışma asistanısın. Kullanıcının ders notlarına dayanarak yardımcı oluyorsun.
Notun içeriği sana verilecek. Türkçe yanıt ver.`;

export async function POST(request: Request) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API anahtarı yapılandırılmamış" },
        { status: 500 }
      );
    }

    const { message, noteContent } = (await request.json()) as {
      message: string;
      noteContent?: string;
    };

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Mesaj gerekli" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fullPrompt = noteContent
      ? `${SYSTEM_PROMPT}\n\n--- DERS NOTU İÇERİĞİ ---\n${noteContent}\n--- NOT SONU ---\n\nKullanıcı sorusu: ${message}`
      : `${SYSTEM_PROMPT}\n\nKullanıcı sorusu: ${message}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "AI yanıtı alınamadı",
      },
      { status: 500 }
    );
  }
}
