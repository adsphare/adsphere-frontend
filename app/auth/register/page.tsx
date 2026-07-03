"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ FIX: create supabase client
  const supabase = useMemo(() => createBrowserSupabase(), []);

  async function handleLogin() {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/auth/check-email");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="w-[400px]">

        <h1 className="text-2xl font-bold mb-4">
          Welcome back to Adsphere
        </h1>

        <input
          className="w-full p-3 bg-black/40 border border-white/10 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-4 bg-blue-600 p-3 rounded"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>

      </div>
    </div>
  );
}