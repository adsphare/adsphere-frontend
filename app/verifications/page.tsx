"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function VerificationPage() {
  const [type, setType] = useState("creator");

  const submit = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) return;

    await supabase.from("verification_requests").insert({
      user_id: data.user.id,
      type,
      status: "pending",
    });

    alert("Submitted for verification");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🛡 Verification</h1>

      <select onChange={(e) => setType(e.target.value)}>
        <option value="creator">Creator</option>
        <option value="brand">Brand</option>
        <option value="advertiser">Advertiser</option>
      </select>

      <button onClick={submit}>Submit</button>
    </div>
  );
}