import { NextResponse } from "next/server";

import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  BOOST_CATALOG,
  type BoostPlan,
} from "@/lib/config/boostCatalog";

export const runtime = "nodejs";

const CHAPA_INITIALIZE_TIMEOUT_MS = 15_000;

function normalizePlan(value: unknown): BoostPlan | null {
  if (typeof value !== "string") {
    return null;
  }

  const plan = value.trim().toLowerCase();

  if (!(plan in BOOST_CATALOG)) {
    return null;
  }

  return plan as BoostPlan;
}

function normalizeListingId(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();

    const chapaSecret = process.env.CHAPA_SECRET_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!chapaSecret || !siteUrl) {
      console.error("Missing Chapa environment configuration");

      return NextResponse.json(
        {
          success: false,
          message: "Payment service is not configured",
        },
        { status: 500 },
      );
    }

    const body = await req.json().catch(() => null);

    const listingId = normalizeListingId(body?.listingId);
    const plan = normalizePlan(body?.plan);

    if (!listingId || !plan) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid listing or Boost plan",
        },
        { status: 400 },
      );
    }

    /*
     * Authenticate the real caller.
     *
     * Identity is NEVER accepted from the browser.
     */
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    if (!user.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Account email is required for payment",
        },
        { status: 400 },
      );
    }

    /*
     * Verify the listing against the authenticated identity.
     *
     * The browser may provide the listing ID,
     * but it cannot choose the owner.
     */
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, user_id, title")
      .eq("id", listingId)
      .maybeSingle();

    if (listingError) {
      console.error("LISTING LOOKUP ERROR:", listingError);

      return NextResponse.json(
        {
          success: false,
          message: "Unable to verify listing",
        },
        { status: 500 },
      );
    }

    if (!listing) {
      return NextResponse.json(
        {
          success: false,
          message: "Listing not found",
        },
        { status: 404 },
      );
    }

    if (listing.user_id !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You don't own this listing",
        },
        { status: 403 },
      );
    }

    /*
     * CANONICAL FINANCIAL RESERVATION
     *
     * The database function owns:
     * - authenticated user identity
     * - listing ownership
     * - canonical amount
     * - canonical currency
     * - Boost score
     * - duration
     * - Boost state
     * - duplicate/open Boost protection
     * - payment creation
     * - provider reference generation
     *
     * No financial row is directly inserted by this route.
     */
    const { data: reservation, error: reservationError } =
      await supabaseAdmin.rpc("reserve_chapa_boost_payment", {
        p_user_id: user.id,
        p_listing_id: listing.id,
        p_plan: plan,
      });

    if (reservationError) {
      console.error(
        "CHAPA BOOST RESERVATION ERROR:",
        reservationError,
      );

      return NextResponse.json(
        {
          success: false,
          message: "Unable to create payment request",
        },
        { status: 500 },
      );
    }

    if (!reservation?.success) {
      const code = reservation?.error;

      if (
        code === "BOOST_ALREADY_ACTIVE" ||
        code === "BOOST_ALREADY_PENDING"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This listing already has a pending or active Boost",
          },
          { status: 409 },
        );
      }

      if (code === "NOT_LISTING_OWNER") {
        return NextResponse.json(
          {
            success: false,
            message: "You don't own this listing",
          },
          { status: 403 },
        );
      }

      if (code === "INVALID_PLAN") {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid Boost plan",
          },
          { status: 400 },
        );
      }

      if (code === "LISTING_NOT_FOUND") {
        return NextResponse.json(
          {
            success: false,
            message: "Listing not found",
          },
          { status: 404 },
        );
      }

      if (code === "USER_NOT_FOUND") {
        return NextResponse.json(
          {
            success: false,
            message: "Unable to verify account",
          },
          { status: 403 },
        );
      }

      console.error(
        "CHAPA BOOST RESERVATION REJECTED:",
        reservation,
      );

      return NextResponse.json(
        {
          success: false,
          message: "Unable to create payment request",
        },
        { status: 409 },
      );
    }

    const paymentId = reservation.paymentId;
    const boostId = reservation.boostId;
    const txRef = reservation.providerReference;

    if (
      typeof paymentId !== "string" ||
      paymentId.trim().length === 0 ||
      typeof boostId !== "string" ||
      boostId.trim().length === 0 ||
      typeof txRef !== "string" ||
      txRef.trim().length === 0
    ) {
      console.error(
        "INVALID RESERVATION RESPONSE:",
        reservation,
      );

      return NextResponse.json(
        {
          success: false,
          message: "Unable to create payment request",
        },
        { status: 500 },
      );
    }

    /*
     * The database is the financial authority.
     *
     * Do not fall back to browser input or local catalog values.
     * The local catalog is only used to detect configuration drift.
     */
    const catalog = BOOST_CATALOG[plan];

    const rawAmount = reservation.amount;
    const currency = reservation.currency;

    /*
     * PostgreSQL numeric values may arrive through the client
     * as either a number or a numeric string.
     *
     * We normalize only for validation and provider serialization.
     * We never substitute the local catalog amount when the
     * database authority fails to return a value.
     */
    const amount =
      typeof rawAmount === "number"
        ? rawAmount
        : typeof rawAmount === "string" &&
            rawAmount.trim().length > 0
          ? Number(rawAmount)
          : NaN;

    if (
      !Number.isFinite(amount) ||
      amount !== catalog.amount ||
      typeof currency !== "string" ||
      currency !== catalog.currency
    ) {
      console.error(
        "BOOST CATALOG / DB AUTHORITY MISMATCH:",
        {
          plan,
          amount: rawAmount,
          normalizedAmount: amount,
          currency,
          expectedAmount: catalog.amount,
          expectedCurrency: catalog.currency,
        },
      );

      /*
       * The reservation already exists.
       *
       * This is a deterministic internal configuration error,
       * not an ambiguous provider/network failure, so the
       * reservation may be transitioned to its failure state.
       */
      try {
        const { error: failureError } =
          await supabaseAdmin.rpc(
            "fail_chapa_boost_payment_initialization",
            {
              p_payment_id: paymentId,
            },
          );

        if (failureError) {
          console.error(
            "CHAPA PAYMENT FAILURE RECONCILIATION ERROR:",
            failureError,
          );
        }
      } catch (failureError) {
        console.error(
          "CHAPA PAYMENT FAILURE RECONCILIATION ERROR:",
          failureError,
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Payment configuration mismatch",
        },
        { status: 500 },
      );
    }

    /*
     * Initialize Chapa only after the internal payment attempt
     * has been atomically reserved.
     */
    const controller = new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      CHAPA_INITIALIZE_TIMEOUT_MS,
    );

    let chapaResponse: Response;

    try {
      chapaResponse = await fetch(
        "https://api.chapa.co/v1/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${chapaSecret}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: String(amount),
            currency,
            email: user.email,

            first_name:
              typeof user.user_metadata?.first_name === "string"
                ? user.user_metadata.first_name
                : "Adspheria",

            last_name:
              typeof user.user_metadata?.last_name === "string"
                ? user.user_metadata.last_name
                : "Customer",

            tx_ref: txRef,

            callback_url: `${siteUrl}/api/chapa/verify`,
            return_url: `${siteUrl}/boost/success`,

            customization: {
              title: "Adspheria Boost",
              description: `${plan} visibility boost for ${listing.title}`,
            },
          }),
          signal: controller.signal,
        },
      );
    } catch (chapaError) {
      console.error(
        "CHAPA INITIALIZATION REQUEST ERROR:",
        {
          paymentId,
          boostId,
          txRef,
          error: chapaError,
        },
      );

      /*
       * IMPORTANT:
       *
       * A timeout, DNS failure, connection reset, network failure,
       * or other transport error is financially ambiguous.
       *
       * Chapa may have received and accepted the transaction even
       * though Adspheria did not receive the response.
       *
       * Therefore we MUST NOT:
       *
       *   payment  pending → failed
       *   boost    pending → cancelled
       *
       * The reservation remains pending and can be reconciled
       * using the canonical provider-reference verification path.
       */
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment initialization could not be confirmed. Please retry or check payment status.",
          code: "PAYMENT_INITIALIZATION_UNCONFIRMED",
        },
        { status: 502 },
      );
    } finally {
      clearTimeout(timeout);
    }

    const chapaData = await chapaResponse.json().catch(() => null);

    /*
     * We received a definitive HTTP/provider response.
     *
     * A non-success response or malformed successful response
     * means Chapa did not provide a usable checkout URL.
     *
     * This is different from a transport failure because we have
     * received a definitive provider response.
     */
    if (
      !chapaResponse.ok ||
      !chapaData?.data?.checkout_url ||
      typeof chapaData.data.checkout_url !== "string"
    ) {
      console.error("CHAPA INITIALIZATION FAILED:", {
        status: chapaResponse.status,
        paymentId,
        boostId,
        txRef,
      });

      /*
       * Only definitive provider rejection/malformed provider
       * response reaches the failure reconciliation path.
       */
      try {
        const { error: failureError } =
          await supabaseAdmin.rpc(
            "fail_chapa_boost_payment_initialization",
            {
              p_payment_id: paymentId,
            },
          );

        if (failureError) {
          console.error(
            "CHAPA PAYMENT FAILURE RECONCILIATION ERROR:",
            failureError,
          );
        }
      } catch (failureError) {
        console.error(
          "CHAPA PAYMENT FAILURE RECONCILIATION ERROR:",
          failureError,
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Payment initialization failed",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      checkout_url: chapaData.data.checkout_url,
      payment_id: paymentId,
      boost_id: boostId,
    });
  } catch (error) {
    console.error("CHAPA INITIALIZE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Payment initialization failed",
      },
      { status: 500 },
    );
  }
}