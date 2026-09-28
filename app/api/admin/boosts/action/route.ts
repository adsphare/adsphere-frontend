import { NextResponse } from "next/server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();

    await requireAdmin(supabase);

    const body = await req.json().catch(() => null);

    const boostId =
      typeof body?.boostId === "string"
        ? body.boostId.trim()
        : "";

    const action =
      typeof body?.action === "string"
        ? body.action.trim().toLowerCase()
        : "";

    if (!boostId || !action) {
      return NextResponse.json(
        {
          error: "Missing boostId or action",
        },
        { status: 400 }
      );
    }

    /*
     * Financial authority rule:
     *
     * A Boost may NEVER be activated by an admin API mutation.
     *
     * The only supported activation path is verified provider
     * payment reconciliation through the canonical settlement
     * function:
     *
     *   settle_chapa_boost_payment(...)
     *
     * This prevents an unpaid Boost from becoming active and
     * prevents this administrative endpoint from becoming a
     * second financial authority.
     */
    if (action === "activate") {
      return NextResponse.json(
        {
          error: "Direct boost activation is not permitted",
          code: "BOOST_ACTIVATION_REQUIRES_PAYMENT_SETTLEMENT",
        },
        { status: 409 }
      );
    }

    /*
     * Administrative expiration is intentionally separate from
     * payment settlement.
     *
     * Expiration does not move money and therefore does not grant
     * financial value. The listing projection is updated below so
     * an expired Boost cannot leave the listing incorrectly marked
     * as boosted.
     */
    if (action === "expire") {
      const { data, error } = await supabase.rpc(
        "admin_expire_boost",
        {
          p_boost_id: boostId,
        }
      );

      if (error) {
        console.error(
          "ADMIN BOOST EXPIRATION ERROR:",
          error
        );

        const message = error.message ?? "";

        if (message.includes("BOOST_NOT_FOUND")) {
          return NextResponse.json(
            {
              error: "Boost not found",
            },
            { status: 404 }
          );
        }

        if (message.includes("BOOST_NOT_ACTIVE")) {
          return NextResponse.json(
            {
              error: "Only active boosts can be expired",
              code: "BOOST_NOT_ACTIVE",
            },
            { status: 409 }
          );
        }

        if (message.includes("ADMIN_REQUIRED")) {
          return NextResponse.json(
            {
              error: "Admin authorization required",
            },
            { status: 403 }
          );
        }

        if (message.includes("ADMIN_AUTH_REQUIRED")) {
          return NextResponse.json(
            {
              error: "Authentication required",
            },
            { status: 401 }
          );
        }

        return NextResponse.json(
          {
            error: "Unable to expire boost",
            code: "BOOST_EXPIRATION_FAILED",
          },
          { status: 500 }
        );
      }

      const expiredBoost = Array.isArray(data)
        ? data[0]
        : data;

      if (!expiredBoost) {
        return NextResponse.json(
          {
            error: "Boost expiration returned no result",
            code: "BOOST_EXPIRATION_NO_RESULT",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        already_expired:
          expiredBoost.already_expired === true,
        boost: {
          id: expiredBoost.id,
          listing_id: expiredBoost.listing_id,
          user_id: expiredBoost.user_id,
          plan: expiredBoost.plan,
          amount: expiredBoost.amount,
          status: expiredBoost.status,
          starts_at: expiredBoost.starts_at,
          expires_at: expiredBoost.expires_at,
        },
      });
    }

    return NextResponse.json(
      {
        error: "Invalid action",
      },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error(
      "ADMIN BOOST ACTION ERROR:",
      err instanceof Error ? err.message : err
    );

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}