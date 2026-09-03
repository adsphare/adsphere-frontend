"use client";

import { useRef, useState } from "react";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "video/mp4",
  "application/pdf",
]);

export default function EvidenceUpload({
  disputeId,
}: {
  disputeId: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function upload() {
    if (!file || loading) return;

    setMessage("");

    if (!ALLOWED_TYPES.has(file.type)) {
      setMessage("Unsupported file type.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage("File must be 50 MB or smaller.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("disputeId", disputeId);

      const res = await fetch("/api/evidence/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage("Evidence uploaded successfully.");
      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Evidence upload failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,.mp4,.pdf"
        disabled={loading}
        onChange={(event) => {
          setFile(event.target.files?.[0] ?? null);
          setMessage("");
        }}
        className="block w-full text-sm text-white/70"
      />

      {file && (
        <p className="mt-2 text-sm text-white/60">
          Selected: {file.name}
        </p>
      )}

      <button
        type="button"
        onClick={upload}
        disabled={!file || loading}
        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Evidence"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-white/70">
          {message}
        </p>
      )}
    </div>
  );
}
