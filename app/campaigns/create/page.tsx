"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export default function CreateCampaignPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ FIX: create supabase instance
  const supabase = createBrowserSupabase();

  const createCampaign = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("User not authenticated");
        return;
      }

      const { error } = await supabase.from("campaigns").insert({
        user_id: user.id,
        title,
        description,
        budget: 0,
        status: "draft",
      });

      if (error) {
        console.error("Campaign error:", error.message);
        alert(error.message);
        return;
      }

      alert("Campaign created!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      console.error(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Campaign</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />

      <button onClick={createCampaign} disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
}