import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error: "Legacy escrow auto-release cron is disabled.",
      code: "LEGACY_ESCROW_FLOW_DISABLED",
    },
    { status: 409 },
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Legacy escrow auto-release cron is disabled.",
      code: "LEGACY_ESCROW_FLOW_DISABLED",
    },
    { status: 409 },
  );
}
