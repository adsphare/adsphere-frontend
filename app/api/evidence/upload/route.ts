import { NextResponse } from "next/server";
import { uploadEvidence } from "@/lib/evidence/uploadEvidence";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const disputeId = formData.get("disputeId") as string;
    const userId = formData.get("userId") as string;

    if (!file || !disputeId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await uploadEvidence(
      file,
      disputeId,
      userId
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}




