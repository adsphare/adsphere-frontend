import { chapaConfig } from "./client";

type ChapaCheckoutParams = {
  amount: number;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
};

export async function createChapaCheckout(data: ChapaCheckoutParams) {
  if (!chapaConfig.secretKey) {
    throw new Error("Missing CHAPA_SECRET_KEY");
  }

  const res = await fetch(
    `${chapaConfig.baseUrl}/transaction/initialize`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chapaConfig.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        amount: Number(data.amount),
      }),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result?.message || "Chapa checkout initialization failed"
    );
  }

  if (!result?.data?.checkout_url) {
    throw new Error("Invalid Chapa response: missing checkout URL");
  }

  return {
    success: true,
    checkoutUrl: result.data.checkout_url,
    tx_ref: data.tx_ref,
    raw: result,
  };
}





