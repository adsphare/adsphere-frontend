import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { evaluateMessage } from "@/lib/core/enforcement/policyEngine";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    /*
     * Authenticate using the user's normal session.
     * The browser never controls the sender identity.
     */
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "INVALID_JSON" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    const input = body as Record<string, unknown>;

    const conversationId =
      typeof input.conversationId === "string"
        ? input.conversationId.trim()
        : "";

    const content =
      typeof input.content === "string"
        ? input.content.trim()
        : "";

    const type =
      typeof input.type === "string" && input.type.trim()
        ? input.type.trim()
        : "text";

    if (!conversationId) {
      return NextResponse.json(
        { error: "CONVERSATION_ID_REQUIRED" },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "MESSAGE_CONTENT_REQUIRED" },
        { status: 400 }
      );
    }

    if (content.length > 10000) {
      return NextResponse.json(
        { error: "MESSAGE_TOO_LONG" },
        { status: 400 }
      );
    }

    /*
     * Verify conversation membership using the user's authenticated
     * session before invoking the privileged transaction.
     */
    const { data: conversation, error: conversationError } =
      await supabase
        .from("conversations")
        .select("id, buyer_id, seller_id, owner_id")
        .eq("id", conversationId)
        .maybeSingle();

    if (conversationError) {
      console.error(
        "Message conversation lookup failed:",
        conversationError.message
      );

      return NextResponse.json(
        { error: "CONVERSATION_LOOKUP_FAILED" },
        { status: 500 }
      );
    }

    if (!conversation) {
      return NextResponse.json(
        { error: "CONVERSATION_NOT_FOUND" },
        { status: 404 }
      );
    }

    const participant =
      conversation.buyer_id === user.id ||
      conversation.seller_id === user.id ||
      conversation.owner_id === user.id;

    if (!participant) {
      return NextResponse.json(
        { error: "NOT_CONVERSATION_PARTICIPANT" },
        { status: 403 }
      );
    }

    /*
     * SERVER-AUTHORITATIVE MESSAGE POLICY
     *
     * Never trust a client-side policy decision.
     * The authenticated session determines the user identity,
     * and the server reads the authoritative trust score.
     *
     * Policy decisions happen before the privileged atomic RPC.
     * Therefore a blocked message produces no message row and
     * no trust event.
     */
    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, trust_score")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
      console.error(
        "Message trust profile lookup failed:",
        profileError.message
      );

      return NextResponse.json(
        { error: "TRUST_PROFILE_LOOKUP_FAILED" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "PROFILE_NOT_FOUND" },
        { status: 409 }
      );
    }

    const trustScore = Math.max(
      0,
      Math.min(100, Number(profile.trust_score ?? 50))
    );

    const decision = evaluateMessage({
      userId: user.id,
      conversationId,
      content,
      trustScore,
    });

    /*
     * BLOCK is authoritative.
     *
     * WARN is intentionally allowed for now because the existing
     * enforcement model had no server-side warning workflow.
     * ESCALATE is also not silently converted into a block until
     * an actual escalation workflow exists.
     */
    if (decision === "BLOCK") {
      return NextResponse.json(
        { error: "MESSAGE_BLOCKED", reason: "POLICY_BLOCK" },
        { status: 403 }
      );
    }

    /*
     * Canonical financial/security pattern:
     *
     *   user session
     *       ?
     *   authenticated user.id
     *       ?
     *   privileged server client
     *       ?
     *   atomic DB transaction
     *
     * The browser cannot supply:
     *   sender_id
     *   trust event key
     *   trust event type
     *   trust score delta
     *   trust source ID
     */
    const { data, error } = await supabaseAdmin.rpc(
      "send_message_atomic",
      {
        p_user_id: user.id,
        p_conversation_id: conversationId,
        p_message: content,
        p_type: type,
      }
    );

    if (error) {
      console.error(
        "Atomic message transaction failed:",
        error.message
      );

      const knownErrors: Record<string, { status: number; error: string }> = {
        FORBIDDEN: {
          status: 403,
          error: "FORBIDDEN",
        },
        INVALID_USER: {
          status: 400,
          error: "INVALID_USER",
        },
        INVALID_CONVERSATION: {
          status: 400,
          error: "INVALID_CONVERSATION",
        },
        CONVERSATION_NOT_FOUND: {
          status: 404,
          error: "CONVERSATION_NOT_FOUND",
        },
        NOT_CONVERSATION_PARTICIPANT: {
          status: 403,
          error: "NOT_CONVERSATION_PARTICIPANT",
        },
        PROFILE_NOT_FOUND: {
          status: 409,
          error: "PROFILE_NOT_FOUND",
        },
        INVALID_MESSAGE: {
          status: 400,
          error: "MESSAGE_CONTENT_REQUIRED",
        },
        MESSAGE_TOO_LONG: {
          status: 400,
          error: "MESSAGE_TOO_LONG",
        },
      };

      const mapped = knownErrors[error.message];

      if (mapped) {
        return NextResponse.json(
          { error: mapped.error },
          { status: mapped.status }
        );
      }

      return NextResponse.json(
        { error: "MESSAGE_CREATE_FAILED" },
        { status: 500 }
      );
    }

    if (!data || typeof data !== "object") {
      console.error("Atomic message transaction returned invalid data");

      return NextResponse.json(
        { error: "MESSAGE_CREATE_FAILED" },
        { status: 500 }
      );
    }

    /*
     * The RPC intentionally returns the authoritative message ID.
     * Fetch the created row through the privileged client so the API
     * preserves the existing { message: data } response shape.
     */
    const result = data as {
      message_id?: string;
    };

    if (!result.message_id) {
      console.error("Atomic message transaction returned no message_id");

      return NextResponse.json(
        { error: "MESSAGE_CREATE_FAILED" },
        { status: 500 }
      );
    }

    const { data: message, error: messageError } =
      await supabaseAdmin
        .from("messages")
        .select("*")
        .eq("id", result.message_id)
        .single();

    if (messageError || !message) {
      console.error(
        "Created message lookup failed:",
        messageError?.message
      );

      return NextResponse.json(
        { error: "MESSAGE_CREATE_FAILED" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message },
      { status: 201 }
    );
  } catch (error) {
    console.error("Message send error:", error);

    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}

