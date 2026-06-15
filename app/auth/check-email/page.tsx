"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function CheckEmailPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050816] text-white px-6">
      <div className="w-full max-w-md text-center">

        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur">

          <h1 className="text-3xl font-bold mb-3">
            Check your email ✉️
          </h1>

          <p className="text-white/60 mb-6">
            We’ve sent you a magic link. Click the link in your email to sign in.
          </p>

          <div className="space-y-3">

            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full"
            >
              Back to Login
            </Button>

            <Button
              onClick={() => router.push("/auth/register")}
              className="w-full bg-white/10 hover:bg-white/20"
            >
              Create Another Account
            </Button>

          </div>

          <p className="text-xs text-white/40 mt-6">
            Didn’t receive the email? Check spam or try again.
          </p>

        </div>
      </div>
    </main>
  );
}