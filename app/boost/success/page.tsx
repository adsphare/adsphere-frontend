
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type VerifyState = "verifying" | "success" | "failed";

export default function SuccessPage() {
  const router = useRouter();


  const [state, setState] =
    useState<VerifyState>("verifying");

  const [message, setMessage] = useState(
    "Confirming your payment..."
  );

  useEffect(() => {
    const txRef: string | null =
      new URLSearchParams(window.location.search).get("tx_ref") ||
      new URLSearchParams(window.location.search).get("trx_ref");

    if (txRef === null || txRef.trim() === "") {
      setState("failed");
      setMessage(
        "Payment confirmation reference is missing."
      );
      return;
    }

    const verifiedTxRef: string = txRef;

    let cancelled = false;

    async function verify() {
      try {
        const response = await fetch(
          "/api/chapa/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tx_ref: verifiedTxRef,
            }),
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setState("failed");
          setMessage(
            data?.message ||
              "Payment confirmation failed."
          );
          return;
        }

        if (
          data?.verified === true &&
          data?.settled === true
        ) {
          setState("success");

          setMessage(
            "Payment confirmed. Your boost is now active."
          );

          const timeout = setTimeout(() => {
            router.push("/marketplace");
          }, 2000);

          return () => clearTimeout(timeout);
        }

        if (
          data?.verified === true &&
          data?.settled === false
        ) {
          setState("failed");

          setMessage(
            "Payment was verified, but the boost could not be activated."
          );

          return;
        }

        setState("failed");

        setMessage(
          "Payment has not been confirmed."
        );
      } catch (error) {
        console.error(
          "CHAPA PAYMENT CONFIRMATION ERROR:",
          error
        );

        if (!cancelled) {
          setState("failed");

          setMessage(
            "We could not confirm the payment. Please try again."
          );
        }
      }
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050814] text-white px-6">
      <div className="w-full max-w-md text-center">

        {state === "verifying" && (
          <>
            <div className="mx-auto mb-6 h-10 w-10 rounded-full border-2 border-white/20 border-t-blue-500 animate-spin" />

            <h1 className="text-2xl font-semibold">
              Confirming payment
            </h1>

            <p className="mt-3 text-white/50">
              {message}
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/15 border border-blue-500/30 text-2xl">
              âœ“
            </div>

            <h1 className="text-2xl font-semibold">
              Boost activated
            </h1>

            <p className="mt-3 text-white/50">
              {message}
            </p>

            <p className="mt-4 text-sm text-white/30">
              Redirecting to the marketplace...
            </p>
          </>
        )}

        {state === "failed" && (
          <>
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-xl">
              !
            </div>

            <h1 className="text-2xl font-semibold">
              Payment confirmation failed
            </h1>

            <p className="mt-3 text-white/50">
              {message}
            </p>

            <button
              onClick={() =>
                router.push("/marketplace")
              }
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 transition"
            >
              Return to Marketplace
            </button>
          </>
        )}

      </div>
    </div>
  );
}





