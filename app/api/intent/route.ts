import { NextResponse } from "next/server";
import { intentEngine } from "@/lib/intent/intentEngine";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type !== "intent") {
      return NextResponse.json(
        { error: "Invalid message type" },
        { status: 400 }
      );
    }

    const result = await intentEngine.handle(body);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}





