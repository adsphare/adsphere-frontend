import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createClient();

  try {
    // 1. Get logged-in user (NEVER trust frontend userId)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse request
    const { listingId, plan } = await req.json();

    if (!listingId || !plan) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 3. Validate listing ownership
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, user_id, title")
      .eq("id", listingId)
      .single();

    if (listingError || !listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (listing.user_id !== user.id) {
      return NextResponse.json(
        { error: "Not your listing" },
        { status: 403 }
      );
    }

    // 4. Define boost plans (BACKEND CONTROLLED)
    const plans: any = {
      basic: {
        price: 5,
        days: 3,
        boost_score: 10,
      },
      premium: {
        price: 15,
        days: 7,
        boost_score: 30,
      },
    };

    const selected = plans[plan];

    if (!selected) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    // 5. Create Chapa payment payload
    const tx_ref = `boost_${Date.now()}_${user.id}`;

    const chapaPayload = {
      amount: selected.price,
      currency: "ETB",
      email: user.email,
      first_name: user.email?.split("@")[0],
      tx_ref,
      callback_url: `${process.env.NEXT_PUBLIC_URL}/api/boost/webhook`,
      return_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      customization: {
        title: "Boost Listing",
        description: listing.title,
      },
      meta: {
        user_id: user.id,
        listing_id: listingId,
        plan,
        boost_score: selected.boost_score,
        days: selected.days,
      },
    };

    // 6. Call Chapa API
    const chapaRes = await fetch(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chapaPayload),
      }
    );

    const chapaData = await chapaRes.json();

    if (!chapaData?.data?.checkout_url) {
      return NextResponse.json(
        { error: "Chapa init failed" },
        { status: 500 }
      );
    }

    // 7. Return checkout URL
    return NextResponse.json({
      checkout_url: chapaData.data.checkout_url,
    });
  } catch (err) {
    console.error("BOOST CHECKOUT ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}