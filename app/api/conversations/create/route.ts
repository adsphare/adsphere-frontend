import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
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
    const listingId =
      typeof input.listingId === "string"
        ? input.listingId.trim()
        : "";

    if (!listingId) {
      return NextResponse.json(
        { error: "LISTING_ID_REQUIRED" },
        { status: 400 }
      );
    }

    /*
     * Seller identity is authoritative from the listing.
     * Never trust buyerId/sellerId supplied by the browser.
     */
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, user_id")
      .eq("id", listingId)
      .maybeSingle();

    if (listingError) {
      console.error(
        "Conversation listing lookup failed:",
        listingError.message
      );

      return NextResponse.json(
        { error: "LISTING_LOOKUP_FAILED" },
        { status: 500 }
      );
    }

    if (!listing) {
      return NextResponse.json(
        { error: "LISTING_NOT_FOUND" },
        { status: 404 }
      );
    }

    if (!listing.user_id) {
      return NextResponse.json(
        { error: "LISTING_OWNER_MISSING" },
        { status: 409 }
      );
    }

    const buyerId = user.id;
    const sellerId = listing.user_id;

    if (buyerId === sellerId) {
      return NextResponse.json(
        { error: "CANNOT_MESSAGE_OWN_LISTING" },
        { status: 400 }
      );
    }

    /*
     * Find the canonical conversation.
     */
    const { data: existing, error: findError } = await supabase
      .from("conversations")
      .select("*")
      .eq("listing_id", listingId)
      .eq("buyer_id", buyerId)
      .eq("seller_id", sellerId)
      .maybeSingle();

    if (findError) {
      console.error(
        "Conversation lookup failed:",
        findError.message
      );

      return NextResponse.json(
        { error: "CONVERSATION_LOOKUP_FAILED" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }

    /*
     * RLS requires buyer_id = auth.uid().
     * seller_id comes exclusively from listings.user_id.
     */
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      /*
       * Another request may have won the unique race.
       * Re-read the canonical conversation instead of creating another one.
       */
      if (error.code === "23505") {
        const { data: racedConversation, error: raceLookupError } =
          await supabase
            .from("conversations")
            .select("*")
            .eq("listing_id", listingId)
            .eq("buyer_id", buyerId)
            .eq("seller_id", sellerId)
            .maybeSingle();

        if (!raceLookupError && racedConversation) {
          return NextResponse.json(racedConversation, { status: 200 });
        }
      }

      console.error(
        "Conversation creation failed:",
        error.message
      );

      return NextResponse.json(
        { error: "CONVERSATION_CREATE_FAILED" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Conversation create error:", error);

    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
