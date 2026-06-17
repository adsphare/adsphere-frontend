import { NextResponse } from "next/server";
import Stripe from "stripe";
<<<<<<< HEAD
import { activateBoost } from "@/lib/boost/activateBoost";
=======
>>>>>>> 6c58162 (refactor: move globals.css to app, add 3D scene system, stabilize layout architecture)

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!sig) {
<<<<<<< HEAD
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
=======
    return new NextResponse("Missing stripe signature", { status: 400 });
>>>>>>> 6c58162 (refactor: move globals.css to app, add 3D scene system, stabilize layout architecture)
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
<<<<<<< HEAD
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  /* =========================
     BOOST SUCCESS EVENT
  ========================= */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const listingId = session.metadata?.listingId;
    const plan = session.metadata?.plan;

    if (!listingId || !plan) {
      return NextResponse.json(
        { error: "Missing metadata in session" },
        { status: 400 }
      );
    }

    await activateBoost({
      listingId,
      plan: plan as "basic" | "pro" | "premium",
      provider: "stripe",
    });
=======
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  // ==============================
  // HANDLE STRIPE EVENTS
  // ==============================
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const meta = session.metadata as {
        type?: string;
        listingId?: string;
        plan?: "basic" | "premium";
        userId?: string;
      };

      if (meta?.type === "boost" && meta.listingId) {
        try {
          // ==============================
          // REPLACE THIS WITH YOUR DB LOGIC
          // ==============================
          console.log("🚀 BOOST PURCHASED");

          console.log({
            listingId: meta.listingId,
            plan: meta.plan ?? "basic",
            userId: meta.userId,
          });

          // Example (Supabase / Prisma later):
          // await supabase
          //   .from("listings")
          //   .update({
          //     boosted: true,
          //     boost_plan: meta.plan ?? "basic",
          //     boosted_at: new Date().toISOString(),
          //   })
          //   .eq("id", meta.listingId);

        } catch (err) {
          console.error("❌ Failed to process boost:", err);
        }
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
>>>>>>> 6c58162 (refactor: move globals.css to app, add 3D scene system, stabilize layout architecture)
  }

  return NextResponse.json({ received: true });
}