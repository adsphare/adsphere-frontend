import { NextResponse } from "next/server";
import { cronService } from "@/lib/services/cron.service";

export async function GET() {
  try {
const result = await cronService.expireBoosts();

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}






