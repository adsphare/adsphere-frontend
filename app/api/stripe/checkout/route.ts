import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

/* =========================
   ENV SAFETY
========================= */

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}


/* =========================
   STRIPE CLIENT
========================= */

const stripe = new Stripe(secretKey, {
  apiVersion: "2026-06-24.dahlia",
});


/* =========================
   BOOST PRICES
   Stripe uses cents
========================= */

const BOOST_PRICES: Record<string, number> = {
  basic: 500,       // $5.00
  premium: 1200,    // $12.00
};


/* =========================
   CREATE CHECKOUT SESSION
========================= */

export async function POST(req: Request) {
  try {

    const body = await req.json();


    const {
      listingId,
      userId,
      plan,
      agreementId,
    } = body;



    /* =========================
       VALIDATION
    ========================= */

    if (!listingId || !userId || !plan) {

      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        {
          status: 400,
        }
      );

    }



    const amount = BOOST_PRICES[plan];


    if (!amount) {

      return NextResponse.json(
        {
          success: false,
          error: "Invalid boost plan",
        },
        {
          status: 400,
        }
      );

    }



    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";



    /* =========================
       STRIPE CHECKOUT
    ========================= */

    const session =
      await stripe.checkout.sessions.create({

        mode: "payment",


        payment_method_types: [
          "card",
        ],



        line_items: [

          {
            price_data: {

              currency: "usd",


              product_data: {

                name:
                  `Adspheria Boost - ${plan}`,

                description:
                  "Visibility boost for Adspheria marketplace listing",

              },


              unit_amount: amount,

            },


            quantity: 1,

          },

        ],



        success_url:
          `${baseUrl}/boost/success?session_id={CHECKOUT_SESSION_ID}`,


        cancel_url:
          `${baseUrl}/boost/cancel`,



        /* =========================
           WEBHOOK DATA
        ========================= */

        metadata: {

          type: "boost",

          listingId:
            String(listingId),


          userId:
            String(userId),


          plan:
            String(plan),


          agreementId:
            agreementId
              ? String(agreementId)
              : "",

        },

      });



    return NextResponse.json({

      success: true,

      url: session.url,

    });



  } catch (error: any) {


    console.error(
      "STRIPE CHECKOUT ERROR:",
      error
    );


    return NextResponse.json(

      {
        success: false,

        error:
          error?.message ??
          "Internal server error",
      },

      {
        status: 500,
      }

    );

  }
}