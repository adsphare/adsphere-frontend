"use client";

import { useState } from "react";

export default function EvidenceUpload({
  disputeId,
  userId,
}: {
  disputeId: string;
  userId: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("disputeId", disputeId);
    formData.append("userId", userId);

    const res = await fetch("/api/evidence/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Evidence uploaded");
    setFile(null);
  }

  return (
    <div className="p-3 border border-white/10 rounded-lg bg-black/30">
      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <button
        onClick={upload}
        disabled={loading}
        className="mt-2 px-3 py-1 bg-blue-600 rounded"
      >
        {loading ? "Uploading..." : "Upload Evidence"}
      </button>
    </div>
  );
}





