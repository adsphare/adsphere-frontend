import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { listingId, plan, email } = await req.json();

    if (!listingId || !plan) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    const tx_ref = `boost_${listingId}_${Date.now()}`;

    const prices: Record<string, string> = {
      basic: "100",
      pro: "250",
      premium: "500",
    };

    const res = await fetch(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: prices[plan],
          currency: "ETB",

          // ⚠️ MUST be real user email in production
          email: email || "test@adsphere.com",

          first_name: "AdSphere",
          last_name: "User",

          tx_ref,

          // 🔥 IMPORTANT: ALWAYS point to your verify API
          callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/chapa/verify`,

          // optional user redirect after payment
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace?boost=success`,

          customization: {
            title: "Boost Listing",
            description: `${plan} boost payment`,
          },
        }),
      }
    );

    const data = await res.json();

    // 🔥 SAFE CHECK
    if (!data?.data?.checkout_url) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize payment",
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
  } catch (err) {
    console.error("Chapa init error:", err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}