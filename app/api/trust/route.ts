import { NextResponse } from "next/server";
import { trustScore } from "@/lib/core/trust/trustScore";

export async function POST(req: Request) {
  try {
    const { userIds } = await req.json();

    if (!Array.isArray(userIds)) {
      return NextResponse.json(
        { error: "Invalid userIds" },
        { status: 400 }
      );
    }

    const scores: Record<string, number> = {};

    for (const id of userIds) {
      scores[id] = await trustScore.get(id);
    }

    return NextResponse.json(scores);

  } catch (error) {
    console.error("TRUST API ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}