"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying"
  );

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [sessionId]);

  async function verifyPayment() {
    try {
      // ✅ REAL FLOW (later: replace with API + Stripe webhook check)
      await new Promise((res) => setTimeout(res, 1200));

      setStatus("success");
    } catch (err) {
      console.log("Verification error:", err);
      setStatus("failed");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        <div className="text-center space-y-2">
          <div className="animate-pulse text-blue-400 text-lg">
            Verifying payment...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050816] text-white px-6">

      <div className="max-w-md w-full text-center space-y-6 bg-white/5 border border-white/10 p-8 rounded-2xl">

        {/* ICON */}
        <div className="text-5xl">
          {status === "success" ? "🎉" : "❌"}
        </div>

        {/* TITLE */}
        <h1
          className={`text-2xl font-bold ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {status === "success"
            ? "Payment Successful"
            : "Payment Failed"}
        </h1>

        {/* DESCRIPTION */}
        <p className="text-white/60 text-sm">
          {status === "success"
            ? "Your AdSphere boost is now active and visible in the marketplace."
            : "Something went wrong. Please try again."}
        </p>

        {/* SESSION ID (DEBUG) */}
        {sessionId && (
          <p className="text-[10px] text-white/30 break-all">
            session: {sessionId}
          </p>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 justify-center pt-2">

          <button
            onClick={() => router.push("/marketplace")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm"
          >
            Go Marketplace
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 border border-white/20 rounded-lg text-sm"
          >
            Dashboard
          </button>

        </div>

      </div>

    </main>
  );
}