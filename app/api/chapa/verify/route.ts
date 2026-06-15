import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tx_ref, listingId } = body;

    if (!tx_ref || !listingId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing fields",
        },
        { status: 400 }
      );
    }

    // VERIFY PAYMENT WITH CHAPA
    const verifyRes = await fetch(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const data = await verifyRes.json();

    // PAYMENT FAILED
    if (!verifyRes.ok || data.status !== "success") {
      return NextResponse.json({
        success: false,
        message: "Payment not verified",
        data,
      });
    }

    // ACTIVATE BOOST
    const { error } = await supabase
      .from("listings")
      .update({
        boost_score: 1,
        boost_expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
      .eq("id", listingId);

    if (error) {
      console.log("Supabase error:", error);

      return NextResponse.json({
        success: false,
        error: "Database update failed",
      });
    }

    // UPDATE RANKING SCORE
    const { error: rankError } = await supabase.rpc(
      "update_listing_rank"
    );

    if (rankError) {
      console.log("Ranking update error:", rankError);
    }

    return NextResponse.json({
      success: true,
      message: "Boost activated successfully",
    });

  } catch (err) {
    console.log("VERIFY ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}