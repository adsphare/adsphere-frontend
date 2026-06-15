"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "";

      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          emailRedirectTo: `${origin}/dashboard`,
        },
      });

      if (error) {
        console.error("Register error:", error);
        alert(error.message);
        return;
      }

      alert("Check your email to complete registration ✉️");

      setEmail("");

      router.push("/auth/check-email");

    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050816] text-white px-6">
      <div className="w-full max-w-md">

        <h1 className="text-4xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-white/50 mb-6">
          Join AdSphere marketplace
        </p>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur">

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full p-3 rounded-lg mb-4
              bg-black/40 border border-white/10
              outline-none focus:border-blue-500
            "
          />

          <Button
            onClick={handleRegister}
            disabled={loading || !email.trim()}
            className="w-full"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <p className="text-xs text-white/40 text-center mt-4">
            We’ll send you a secure signup link to your email
          </p>

        </div>
      </div>
    </main>
  );
}