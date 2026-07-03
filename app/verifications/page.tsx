
"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export default function VerificationPage() {
  const supabase = createBrowserSupabase(); // ✅ FIX HERE

  const [type, setType] = useState("creator");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      const { data, error: userError } = await supabase.auth.getUser();

      if (userError || !data.user) {
        alert("Not logged in");
        return;
      }

      const { error } = await supabase.from("verification_requests").insert({
        user_id: data.user.id,
        type,
        status: "pending",
      });

      if (error) {
        console.error(error.message);
        alert(error.message);
        return;
      }

      alert("Submitted for verification 🛡");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🛡 Verification</h1>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="creator">Creator</option>
        <option value="brand">Brand</option>
        <option value="advertiser">Advertiser</option>
      </select>

      <button onClick={submit} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}