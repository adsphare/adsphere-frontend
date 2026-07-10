import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
    const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;

    if (!CHAPA_SECRET_KEY || !SITE_URL) {
      return NextResponse.json(
        { success: false, message: "Missing environment variables" },
        { status: 500 }
      );
    }

    const { listingId, plan, email } = await req.json();

    if (!listingId || !plan) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    // 🔐 AUTH CHECK (IMPORTANT FIX)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔐 VERIFY LISTING OWNERSHIP (IMPORTANT FOR SECURITY)
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, user_id")
      .eq("id", listingId)
      .single();

    if (listingError || !listing) {
      return NextResponse.json(
        { success: false, message: "Listing not found" },
        { status: 404 }
      );
    }

    if (listing.user_id !== user.id) {
      return NextResponse.json(
        { success: false, message: "Not your listing" },
        { status: 403 }
      );
    }

    const prices: Record<string, number> = {
      basic: 100,
      pro: 250,
      premium: 500,
    };

    const amount = prices[plan];

    if (!amount) {
      return NextResponse.json(
        { success: false, message: "Invalid boost plan" },
        { status: 400 }
      );
    }

    const tx_ref = `boost_${listingId}_${Date.now()}`;

    // 💰 SAVE PAYMENT RECORD (SAFE)
    const { error: paymentError } = await supabase.from("payments").insert({
      listing_id: listingId,
      user_id: user.id,
      tx_ref,
      provider: "chapa",
      payment_type: "boost",
      amount,
      currency: "ETB",
      status: "pending",
      plan,
    });

    if (paymentError) {
      return NextResponse.json(
        { success: false, message: "Failed to create payment record" },
        { status: 500 }
      );
    }

    // 💳 INIT CHAPA
    const response = await fetch(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "ETB",
          email: email || user.email || "user@Adspheria.com",
          first_name: "Adspheria",
          last_name: "User",
          tx_ref,
          callback_url: `${SITE_URL}/api/chapa/verify`,
          return_url: `${SITE_URL}/boost/success`,
          customization: {
            title: "Boost Listing",
            description: `${plan} Listing Boost`,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data?.data?.checkout_url) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize Chapa payment",
          raw: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checkout_url: data.data.checkout_url,
      tx_ref,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}






