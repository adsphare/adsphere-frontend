import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Legacy escrow action endpoint is disabled.",
      code: "LEGACY_ESCROW_FLOW_DISABLED",
      message:
        "Escrow mutations must use the canonical authorized settlement flow.",
    },
    { status: 409 },
  );
}
