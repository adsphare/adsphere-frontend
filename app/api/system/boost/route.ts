import { NextResponse } from "next/server";
import { activateBoost } from "@/lib/boostService";

export async function POST(req: Request) {
  const { listingId, plan } = await req.json();

  await activateBoost({
    listingId,
    plan,
    provider: "system",
  });

  return NextResponse.json({ success: true });
}