"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [basic, setBasic] = useState("5");
  const [premium, setPremium] = useState("10");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("settings").select("*");

    data?.forEach((s) => {
      if (s.key === "boost_basic") setBasic(s.value);
      if (s.key === "boost_premium") setPremium(s.value);
    });

    setLoading(false);
  }

  async function save() {
    await supabase.from("settings").upsert([
      { key: "boost_basic", value: basic },
      { key: "boost_premium", value: premium },
    ]);

    alert("Settings saved");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        Loading settings...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white p-8 space-y-6">

      <h1 className="text-3xl font-bold">Settings ⚙️</h1>

      <div className="max-w-md space-y-4">

        <div>
          <label className="text-white/60 text-sm">Basic Boost Price</label>
          <input
            value={basic}
            onChange={(e) => setBasic(e.target.value)}
            className="w-full p-3 bg-white/5 border border-white/10 rounded mt-1"
          />
        </div>

        <div>
          <label className="text-white/60 text-sm">Premium Boost Price</label>
          <input
            value={premium}
            onChange={(e) => setPremium(e.target.value)}
            className="w-full p-3 bg-white/5 border border-white/10 rounded mt-1"
          />
        </div>

        <button
          onClick={save}
          className="w-full bg-blue-600 p-3 rounded hover:bg-blue-500"
        >
          Save Settings
        </button>

      </div>
    </main>
  );
}