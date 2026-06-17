import { NextResponse } from "next/server";
<<<<<<< HEAD
import { activateBoost } from "@/lib/boostService";

export async function POST(req: Request) {
  try {
    const { tx_ref, listingId, plan } = await req.json();
=======

export async function POST(req: Request) {
  try {
    const { tx_ref } = await req.json();
>>>>>>> 6c58162 (refactor: move globals.css to app, add 3D scene system, stabilize layout architecture)

    const res = await fetch(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const data = await res.json();

<<<<<<< HEAD
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
=======
    if (data.status === "success") {
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Chapa verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
>>>>>>> 6c58162 (refactor: move globals.css to app, add 3D scene system, stabilize layout architecture)
      { status: 500 }
    );
  }
}