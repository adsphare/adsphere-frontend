import { NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/payment.service";
import { campaignService } from "@/lib/campaigns/campaign.service";
// later: import { boostService } from "@/lib/boost/boost.service";
// later: import { analyticsService } from "@/lib/analytics/analytics.service";

export const runtime = "nodejs";

/* =========================
   STRIPE WEBHOOK (SIMPLIFIED)
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ⚠️ In production: verify Stripe signature here
    const eventType = body.type;
    const paymentId = body.data?.paymentId;
    const campaignId = body.data?.campaignId;

    if (!paymentId || !campaignId) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    /* =========================
       1. PAYMENT SUCCESS EVENT
    ========================= */
    if (eventType === "payment.succeeded") {
      // mark payment as paid
      await paymentService.verifyPayment(paymentId);

      // activate campaign
      await campaignService.activate(campaignId);

      // 🚀 FUTURE HOOKS (we will implement next)
      // await boostService.activate(campaignId);
      // await analyticsService.start(campaignId);
    }

    /* =========================
       2. PAYMENT FAILED EVENT
    ========================= */
    if (eventType === "payment.failed") {
      // optional later
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Webhook failed",
      },
      { status: 500 }
    );
  }
}