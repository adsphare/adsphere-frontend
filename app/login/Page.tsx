"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    login(name, email);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">

      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl">

        <h1 className="text-3xl font-bold mb-6">Login</h1>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl bg-white/5 border border-white/10"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-6 rounded-xl bg-white/5 border border-white/10"
        />

        <Button onClick={handleLogin}>
          Continue
        </Button>

      </div>

    </main>
  );
}