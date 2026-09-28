import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      received: false,
      error: "Legacy Stripe webhook is disabled.",
      code: "LEGACY_STRIPE_WEBHOOK_DISABLED",
      message:
        "Stripe events must be reconciled through the canonical payment settlement flow.",
    },
    { status: 409 },
  );
}
