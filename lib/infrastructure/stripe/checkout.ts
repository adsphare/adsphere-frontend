import { stripe } from "./client";
import Stripe from "stripe";

export async function createCheckoutSession(
  params: Stripe.Checkout.SessionCreateParams
) {
  return stripe.checkout.sessions.create(params);
}




