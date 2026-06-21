import { supabase } from "@/lib/supabase";

export async function createCheckoutSession({
  dealId,
  amount,
}: {
  dealId: string;
  amount: number;
}) {
  // 1. create checkout session (mock structure for now)
  const res = await fetch("/api/checkout", {
    method: "POST",
    body: JSON.stringify({
      dealId,
      amount,
    }),
  });

  const data = await res.json();

  if (!data.url) throw new Error("Payment failed");

  // 2. store session in DB
  await supabase
    .from("deals")
    .update({
      stripe_session_id: data.sessionId,
      payment_status: "pending",
    })
    .eq("id", dealId);

  return data.url;
}