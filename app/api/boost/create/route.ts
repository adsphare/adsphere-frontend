import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { listingId, email } = await req.json();

    // ✅ basic validation
    if (!listingId || !email) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    // ✅ env check
    if (!process.env.CHAPA_SECRET_KEY || !process.env.NEXT_PUBLIC_BASE_URL) {
      return NextResponse.json(
        { success: false, error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const tx_ref = `adsphre-boost-${listingId}-${Date.now()}`;

    const response = await fetch(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
        body: JSON.stringify({
          amount: 100,
          currency: "ETB",
          email,
          tx_ref,

          // where user goes after payment
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?boost=success`,
        }),
      }
    );

    const data = await response.json();

    // ❌ if Chapa fails
    if (!response.ok || !data?.data?.checkout_url) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment initialization failed",
          details: data,
        },
        { status: 400 }
      );
    }

    // ✅ return clean structure for frontend
    return NextResponse.json({
      success: true,
      checkout_url: data.data.checkout_url,
      tx_ref,
    });

  } catch (err) {
    console.log("BOOST API ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}