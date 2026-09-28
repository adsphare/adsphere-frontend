import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      code: "CHAPA_WEBHOOK_DISABLED",
      message: "Chapa webhook processing is disabled. Use the authenticated verification flow.",
    },
    { status: 410 },
  );
}
