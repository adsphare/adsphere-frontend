import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { campaignId, amount, email } = body;

  const tx_ref = `adsp-${Date.now()}`;

  const chapaRes = await fetch("https://api.chapa.co/v1/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "ETB",
      email,
      tx_ref,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&campaign=${campaignId}&tx_ref=${tx_ref}`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    }),
  });

  const data = await chapaRes.json();

  return NextResponse.json({
    checkout_url: data.data.checkout_url,
    tx_ref,
  });
}