import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Legacy escrow refund endpoint is disabled.",
      code: "LEGACY_ESCROW_FLOW_DISABLED",
      message:
        "Refunds must use the canonical authorized settlement flow.",
    },
    { status: 409 },
  );
}
