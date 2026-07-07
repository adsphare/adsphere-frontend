import { chapaConfig } from "./client";

export async function verifyChapaTransaction(tx_ref: string) {
  if (!tx_ref) {
    throw new Error("Missing tx_ref");
  }

  try {
    const res = await fetch(
      `${chapaConfig.baseUrl}/transaction/verify/${tx_ref}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${chapaConfig.secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: `Chapa API error: ${res.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    };
  }
}





