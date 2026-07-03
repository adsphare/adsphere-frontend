import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

    if (!CHAPA_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing CHAPA_SECRET_KEY",
        },
        { status: 500 }
      );
    }

    const { tx_ref } = await req.json();

    if (!tx_ref) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing transaction reference",
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok || data.status !== "success") {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      data,
    });
  } catch (err: any) {
    console.error("Chapa verify error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Server error",
      },
      { status: 500 }
    );
  }
}





