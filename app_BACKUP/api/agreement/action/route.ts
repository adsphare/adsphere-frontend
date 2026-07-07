import { NextResponse } from "next/server";
import { agreementEngine, type AgreementAction } from "@/lib/agreements/agreementEngine";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { action, agreementId } = body;

    if (!action || !agreementId) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const normalizedAction = action.toUpperCase() as AgreementAction;

    const allowedActions: AgreementAction[] = [
      "CREATE",
      "ACCEPT",
      "REJECT",
      "CANCEL",
      "COMPLETE",
    ];

    if (!allowedActions.includes(normalizedAction)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const result = await agreementEngine(normalizedAction, agreementId);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Server error",
      },
      { status: 500 }
    );
  }
}

