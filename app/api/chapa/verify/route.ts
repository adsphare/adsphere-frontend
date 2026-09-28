
import { NextResponse } from "next/server";
import { verifyChapaTransaction } from "@/lib/infrastructure/chapa/verify";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { checkChapaVerifyRateLimit } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

type VerifyRequest = {
  tx_ref?: unknown;
};

type ChapaProviderData = {
  status?: unknown;
  tx_ref?: unknown;
  trx_ref?: unknown;
  amount?: unknown;
  currency?: unknown;
  paid_at?: unknown;
};

type ChapaProviderEnvelope = ChapaProviderData & {
  data?: ChapaProviderData | null;
};

function getTxRef(
  body: VerifyRequest | null,
  request: Request,
): string | null {
  const bodyTxRef =
    typeof body?.tx_ref === "string"
      ? body.tx_ref
      : null;

  if (bodyTxRef && bodyTxRef.trim() !== "") {
    return bodyTxRef.trim();
  }

  const url = new URL(request.url);

  const queryTxRef =
    url.searchParams.get("tx_ref") ??
    url.searchParams.get("trx_ref");

  if (!queryTxRef || queryTxRef.trim() === "") {
    return null;
  }

  return queryTxRef.trim();
}

function isValidTxRef(txRef: string): boolean {
  return /^[A-Za-z0-9_-]{1,255}$/.test(txRef);
}

function normalizeCurrency(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toUpperCase();
}

function normalizeStatus(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

function toAmount(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function getPaidAt(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed === "") {
    return null;
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function getProviderData(
  providerResult: unknown,
): ChapaProviderData {
  if (
    !providerResult ||
    typeof providerResult !== "object"
  ) {
    return {};
  }

  const envelope =
    providerResult as ChapaProviderEnvelope;

  if (
    envelope.data &&
    typeof envelope.data === "object"
  ) {
    return envelope.data;
  }

  return envelope;
}

async function reconcile(txRef: string) {
  const { data: payment, error: paymentError } =
    await supabaseAdmin
      .from("payments")
      .select(
        "id,user_id,provider,status,amount,currency,provider_reference,legacy_transaction_ref,payment_type,boost_id",
      )
      .or(
        `provider_reference.eq.${txRef},legacy_transaction_ref.eq.${txRef}`,
      )
      .maybeSingle();

  if (paymentError) {
    console.error(
      "CHAPA VERIFY PAYMENT LOOKUP ERROR:",
      paymentError,
    );

    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Payment verification failed",
      },
      { status: 500 },
    );
  }

  if (!payment) {
    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Payment not found",
      },
      { status: 404 },
    );
  }

  if (payment.provider !== "chapa") {
    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Invalid payment provider",
      },
      { status: 409 },
    );
  }

  if (payment.payment_type !== "boost") {
    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Invalid payment type",
      },
      { status: 409 },
    );
  }

  if (!payment.boost_id) {
    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Payment is not linked to a boost",
      },
      { status: 409 },
    );
  }

  let providerResult: unknown;

  try {
    providerResult =
      await verifyChapaTransaction(txRef);
  } catch (error) {
    console.error(
      "CHAPA VERIFY PROVIDER ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Payment verification failed",
      },
      { status: 502 },
    );
  }

  if (
    !providerResult ||
    typeof providerResult !== "object" ||
    (providerResult as { success?: unknown }).success !== true
  ) {
    const providerError =
      providerResult &&
      typeof providerResult === "object" &&
      typeof (providerResult as { error?: unknown }).error === "string"
        ? (providerResult as { error: string }).error
        : "Unable to verify transaction with Chapa";

    console.error(
      "CHAPA VERIFY PROVIDER REJECTED:",
      providerError,
    );

    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Payment verification failed",
      },
      { status: 502 },
    );
  }

  const providerData =
    getProviderData(providerResult);

  const providerStatus =
    normalizeStatus(providerData.status);

  const providerTxRef =
    typeof providerData.tx_ref === "string"
      ? providerData.tx_ref.trim()
      : typeof providerData.trx_ref === "string"
        ? providerData.trx_ref.trim()
        : "";

  const providerAmount =
    toAmount(providerData.amount);

  const providerCurrency =
    normalizeCurrency(providerData.currency);

  const internalAmount =
    toAmount(payment.amount);

  const internalCurrency =
    normalizeCurrency(payment.currency);

  if (!providerTxRef) {
    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Provider transaction reference missing",
      },
      { status: 409 },
    );
  }

  if (providerTxRef !== txRef) {
    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Transaction reference mismatch",
      },
      { status: 409 },
    );
  }

  if (providerCurrency !== "ETB") {
    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Invalid payment currency",
      },
      { status: 409 },
    );
  }

  if (internalCurrency !== "ETB") {
    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Internal payment currency mismatch",
      },
      { status: 409 },
    );
  }

  if (
    providerAmount === null ||
    internalAmount === null ||
    providerAmount !== internalAmount
  ) {
    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Payment amount mismatch",
      },
      { status: 409 },
    );
  }

  const { data: boost, error: boostError } =
    await supabaseAdmin
      .from("boosts")
      .select(
        "id,listing_id,user_id,plan,amount,status",
      )
      .eq("id", payment.boost_id)
      .maybeSingle();

  if (boostError) {
    console.error(
      "CHAPA VERIFY BOOST LOOKUP ERROR:",
      boostError,
    );

    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Boost verification failed",
      },
      { status: 500 },
    );
  }

  if (!boost) {
    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Boost not found",
      },
      { status: 404 },
    );
  }

  if (boost.user_id !== payment.user_id) {
    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Payment ownership mismatch",
      },
      { status: 409 },
    );
  }

  /*
   * Provider verification is intentionally separated
   * from settlement.
   *
   * A non-success provider status is not allowed to
   * activate the boost.
   */
  if (providerStatus !== "success") {
    return NextResponse.json({
      success: true,
      verified: false,
      settled: false,
      payment_status: payment.status,
      boost_status: boost.status,
      message: "Payment has not been confirmed by Chapa",
    });
  }

  const paidAt =
    getPaidAt(providerData.paid_at) ??
    new Date().toISOString();

  const { data: settlement, error: settlementError } =
    await supabaseAdmin.rpc(
      "settle_chapa_boost_payment",
      {
        p_payment_id: payment.id,
        p_listing_id: boost.listing_id,
        p_plan: boost.plan,
        p_tx_ref: txRef,
        p_amount: providerAmount,
        p_currency: providerCurrency,
        p_paid_at: paidAt,
      },
    );

  if (settlementError) {
    console.error(
      "CHAPA VERIFY SETTLEMENT ERROR:",
      settlementError,
    );

    return NextResponse.json(
      {
        success: false,
        verified: true,
        settled: false,
        message: "Payment settlement failed",
      },
      { status: 500 },
    );
  }

  if (
    !settlement ||
    settlement.success !== true
  ) {
    console.error(
      "CHAPA VERIFY SETTLEMENT REJECTED:",
      settlement,
    );

    return NextResponse.json(
      {
        success: false,
        verified: true,
        settled: false,
        message: "Payment settlement rejected",
        code: "PAYMENT_SETTLEMENT_REJECTED",
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    success: true,
    verified: true,
    settled: true,
    already_settled:
      settlement.already_settled === true,
    payment_status: "paid",
    boost_status: "active",
    settlement,
  });
}

export async function POST(request: Request) {
  let body: VerifyRequest | null = null;

  try {
    body = (await request.json()) as VerifyRequest;
  } catch {
    body = null;
  }

  const txRef = getTxRef(body, request);

  if (!txRef || !isValidTxRef(txRef)) {
    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Invalid transaction reference",
      },
      { status: 400 },
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  const ip =
    realIp?.trim() ||
    forwardedFor?.split(",")[0]?.trim() ||
    "unknown";

  try {
    const rateLimit = await checkChapaVerifyRateLimit(ip, txRef);

    if (!rateLimit.allowed) {
      const retryAfter = Math.max(
        rateLimit.ip.reset,
        rateLimit.txRef.reset,
      );

      return NextResponse.json(
        {
          success: false,
          verified: false,
          settled: false,
          message: "Too many verification attempts. Please try again later.",
          code: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(1, Math.ceil((retryAfter - Date.now()) / 1000)),
            ),
          },
        },
      );
    }
  } catch (error) {
    console.error("CHAPA VERIFY RATE LIMIT ERROR:", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        verified: false,
        settled: false,
        message: "Payment verification is temporarily unavailable",
        code: "RATE_LIMIT_UNAVAILABLE",
      },
      { status: 503 },
    );
  }

  return reconcile(txRef);
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      verified: false,
      settled: false,
      message: "Payment verification requires POST.",
      code: "METHOD_NOT_ALLOWED",
    },
    { status: 405, headers: { Allow: "POST" } }
  );
}






