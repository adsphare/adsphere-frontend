"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreateCampaignPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createCampaign = async () => {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) return;

    await supabase.from("campaigns").insert({
      user_id: user.user.id,
      title,
      description,
      budget: 0,
      status: "draft",
    });

    alert("Campaign created!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Campaign</h1>

      <input
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />

      <textarea
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />

      <button onClick={createCampaign}>
        Create
      </button>
    </div>
  );
}