"use client";

import { useState } from "react";

export default function CreateCampaignPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const createCampaign = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/campaigns/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Campaign error:", result);
        alert(result.error || "Unable to create campaign");
        return;
      }

      alert("Campaign created!");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong";

      console.error("Campaign creation error:", message);
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
