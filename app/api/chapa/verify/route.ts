import { NextResponse } from "next/server";
import { activateBoost } from "@/lib/boostService";

export async function POST(req: Request) {
  try {
    const { tx_ref, listingId, plan } = await req.json();

    const res = await fetch(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const data = await res.json();

    const isPaid =
      data?.status === "success" &&
      data?.data?.status === "success";

    if (!isPaid) {
      return NextResponse.json(
        { success: false, message: "Payment not confirmed" },
        { status: 400 }
      );
    }

    await activateBoost({
      listingId,
      plan,
      provider: "chapa",
    });

    return NextResponse.json({
      success: true,
      message: "Boost activated",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}