"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ FIX: create supabase client
  const supabase = useMemo(() => createBrowserSupabase(), []);

  async function login() {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Login error:", error.message);
        alert(error.message);
        return;
      }

      router.push("/auth/check-email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
      <div className="p-6 bg-white/5 rounded-xl w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          className="w-full p-2 text-black rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 p-2 rounded"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
      </div>
    </div>
  );
}

