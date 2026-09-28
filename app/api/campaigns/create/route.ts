import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHENTICATED",
        },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_JSON",
        },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_REQUEST",
        },
        { status: 400 }
      );
    }

    const input = body as Record<string, unknown>;

    const title =
      typeof input.title === "string"
        ? input.title.trim()
        : "";

    const description =
      typeof input.description === "string"
        ? input.description.trim()
        : "";

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: "TITLE_REQUIRED",
        },
        { status: 400 }
      );
    }

    if (title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: "TITLE_TOO_LONG",
        },
        { status: 400 }
      );
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: "DESCRIPTION_TOO_LONG",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        brand_id: user.id,
        title,
        description: description || null,
        budget: 0,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      console.error("Campaign creation failed:", error.message);

      return NextResponse.json(
        {
          success: false,
          error: "CAMPAIGN_CREATE_FAILED",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        campaign: data,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Campaign create error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
