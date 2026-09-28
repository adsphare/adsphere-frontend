import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Legacy escrow auto-release endpoint is disabled.",
      code: "LEGACY_ESCROW_FLOW_DISABLED",
      message:
        "Automatic escrow release requires the canonical authorized settlement flow.",
    },
    { status: 409 },
  );
}
