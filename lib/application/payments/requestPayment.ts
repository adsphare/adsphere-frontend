import { createBrowserSupabase } from "@/lib/supabase/browser";

export type PaymentProvider = "chapa" | "stripe";

export interface RequestPaymentInput {
  listingId: string;
  userId: string;
  amount: number;
  provider: PaymentProvider;
  campaignId?: string;
  metadata?: Record<string, unknown>;
}

export interface RequestPaymentResult {
  success: boolean;
  checkoutUrl?: string;
  paymentId?: string;
  error?: string;
}

export async function requestPayment(
  input: RequestPaymentInput
): Promise<RequestPaymentResult> {
  try {
    const supabase = createBrowserSupabase();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch("/api/payments/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token
          ? {
              Authorization: `Bearer ${session.access_token}`,
            }
          : {}),
      },
      body: JSON.stringify(input),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error ?? "Payment request failed",
      };
    }

    return {
      success: true,
      checkoutUrl: result.checkoutUrl,
      paymentId: result.paymentId,
    };
  } catch (error) {
    console.error("requestPayment()", error);

    return {
      success: false,
      error: "Unexpected payment error",
    };
  }
}

