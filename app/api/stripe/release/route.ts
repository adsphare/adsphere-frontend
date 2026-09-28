import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Direct Stripe release is disabled.",
      code: "STRIPE_FINANCIAL_FLOW_DISABLED",
      message:
        "Escrow release must be performed by the canonical authorized settlement flow.",
    },
    { status: 409 },
  );
}