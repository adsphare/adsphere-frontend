import { chapaConfig } from "./client";

const CHAPA_VERIFY_TIMEOUT_MS = 15_000;

function normalizeTxRef(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isValidTxRef(txRef: string): boolean {
  return /^[A-Za-z0-9_-]{1,255}$/.test(txRef);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown Chapa verification error";
}

export async function verifyChapaTransaction(tx_ref: string) {
  const txRef = normalizeTxRef(tx_ref);

  if (!txRef || !isValidTxRef(txRef)) {
    return {
      success: false,
      error: "Invalid tx_ref",
    };
  }

  if (!chapaConfig.baseUrl || !chapaConfig.secretKey) {
    console.error("CHAPA VERIFY CONFIGURATION MISSING");

    return {
      success: false,
      error: "Chapa payment configuration is unavailable",
    };
  }

  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    CHAPA_VERIFY_TIMEOUT_MS,
  );

  try {
    const res = await fetch(
      `${chapaConfig.baseUrl}/transaction/verify/${encodeURIComponent(txRef)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${chapaConfig.secretKey}`,
          Accept: "application/json",
        },
        signal: controller.signal,
        cache: "no-store",
      },
    );

    const rawBody = await res.text();

    let data: unknown = null;

    if (rawBody.trim()) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        console.error("CHAPA VERIFY INVALID JSON RESPONSE:", {
          status: res.status,
          txRef,
        });

        return {
          success: false,
          error: "Invalid response from Chapa",
        };
      }
    }

    if (!res.ok) {
      console.error("CHAPA VERIFY HTTP ERROR:", {
        status: res.status,
        txRef,
      });

      return {
        success: false,
        error: `Chapa API error: ${res.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    const message = getErrorMessage(error);

    console.error("CHAPA VERIFY REQUEST ERROR:", {
      txRef,
      error: message,
    });

    return {
      success: false,
      error:
        message === "This operation was aborted"
          ? "Chapa verification timed out"
          : "Unable to verify transaction with Chapa",
    };
  } finally {
    clearTimeout(timeout);
  }
}