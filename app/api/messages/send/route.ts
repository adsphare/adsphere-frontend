import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🔥 SERVER SUPABASE (IMPORTANT)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let { message, conversationId, senderId } = body;

    // ✅ SAFE TRIM FIRST
    message = message?.trim();

    // 🔥 VALIDATION
    if (!message || !conversationId || !senderId) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 💬 INSERT MESSAGE
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: senderId,
      message,
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("sendMessage error:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}