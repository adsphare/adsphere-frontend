import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Legacy Stripe checkout is disabled.",
      code: "STRIPE_FINANCIAL_FLOW_DISABLED",
    },
    { status: 409 },
  );
}
