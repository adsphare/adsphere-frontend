"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import Button from "@/components/ui/Button";

export default function CheckEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ CREATE SUPABASE INSTANCE ONCE
  const supabase = createBrowserSupabase();

  /* =========================
     AUTO SESSION CHECK
  ========================= */
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session check error:", error.message);
        return;
      }

      if (data?.session) {
        router.push("/auth/callback");
      }
    };

    checkSession();
  }, [router, supabase]);

  /* =========================
     RESEND EMAIL
  ========================= */
  async function resendEmail() {
    try {
      setLoading(true);

      if (typeof window === "undefined") return;

      const email = localStorage.getItem("pending_email");

      if (!email) {
        alert("No email found. Please register again.");
        router.push("/auth/register");
        return;
      }

      const origin = window.location.origin;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Resend error:", error.message);
        alert(error.message);
      } else {
        alert("Email sent successfully ✉️");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      console.error("Resend crash:", message);
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050816] text-white px-6">
      <div className="w-full max-w-md text-center">

        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">

          <h1 className="text-3xl font-bold mb-3">
            Check your email ✉️
          </h1>

          <p className="text-white/60 mb-6">
            We’ve sent you a magic link. Click it to continue.
          </p>

          <div className="space-y-3">

            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full"
            >
              Back to Login
            </Button>

            <Button
              onClick={resendEmail}
              disabled={loading}
              className="w-full bg-white/10 hover:bg-white/20"
            >
              {loading ? "Sending..." : "Resend Email"}
            </Button>

            <Button
              onClick={() => router.push("/auth/callback")}
              className="w-full bg-blue-600 hover:bg-blue-500"
            >
              I already clicked the link
            </Button>

          </div>

          <p className="text-xs text-white/40 mt-6">
            Didn’t receive it? Check spam or try another email.
          </p>

        </div>
      </div>
    </main>
  );
}

