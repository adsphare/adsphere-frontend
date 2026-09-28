import { NextResponse } from "next/server";
import { cronService } from "@/lib/services/cron.service";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const boosts = await cronService.expireBoosts();

    return NextResponse.json({
      success: true,
      boosts,
    });
  } catch (error) {
    console.error("Cron process failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Cron processing failed",
      },
      { status: 500 }
    );
  }
}

