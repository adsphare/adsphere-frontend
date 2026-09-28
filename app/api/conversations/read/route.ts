import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);

    const conversationId =
      typeof body?.conversationId === "string"
        ? body.conversationId.trim()
        : "";

    if (!conversationId) {
      return NextResponse.json(
        { error: "INVALID_CONVERSATION" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc(
      "mark_conversation_read",
      {
        p_conversation_id: conversationId,
      }
    );

    if (error) {
      console.error(
        "mark_conversation_read failed:",
        error.message
      );

      if (
        error.message.includes(
          "CONVERSATION_NOT_FOUND_OR_FORBIDDEN"
        )
      ) {
        return NextResponse.json(
          { error: "CONVERSATION_NOT_FOUND_OR_FORBIDDEN" },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: "CONVERSATION_READ_FAILED" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Conversation read API error:", error);

    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "METHOD_NOT_ALLOWED" },
    { status: 405 }
  );
}
