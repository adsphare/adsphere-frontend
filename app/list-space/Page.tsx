"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ListSpacePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    type: "billboard",
    image: "",
  });

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function submit() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) return;

    await supabase.from("listings").insert({
      ...form,
      user_id: user.id,
      views: 0,
      boost_score: 0,
      created_at: new Date().toISOString(),
    });

    router.push("/marketplace");
  }

  return (
    <main className="max-w-2xl mx-auto space-y-4">

      <h1 className="text-2xl font-bold">Create Listing</h1>

      <input className="input" placeholder="Title"
        onChange={(e) => update("title", e.target.value)}
      />

      <input className="input" placeholder="Location"
        onChange={(e) => update("location", e.target.value)}
      />

      <input className="input" placeholder="Price"
        onChange={(e) => update("price", e.target.value)}
      />

      <input className="input" placeholder="Image URL"
        onChange={(e) => update("image", e.target.value)}
      />

      <button
        onClick={submit}
        className="w-full py-3 bg-blue-600 rounded"
      >
        Create
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
        }
      `}</style>

    </main>
  );
}