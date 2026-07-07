"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import Button from "@/components/ui/Button";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : null;

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("billboard");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    init();
  }, [id]);

  async function init() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (!id) {
      setError("Invalid listing ID");
      setLoading(false);
      return;
    }

    await fetchListing(user.id, id);
  }

  async function fetchListing(uid: string, listingId: string) {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", listingId)
      .eq("user_id", uid)
      .maybeSingle();

    if (error || !data) {
      setError("Listing not found or unauthorized");
      setLoading(false);
      return;
    }

    setTitle(data.title || "");
    setLocation(data.location || "");
    setPrice(data.price || "");
    setType(data.type || "billboard");
    setDescription(data.description || "");
    setImage(data.image || "");

    setLoading(false);
  }

  async function handleUpdate() {
    if (!id) return;

    if (!title || !location || !price) {
      alert("Title, location, and price are required");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("listings")
      .update({
        title,
        location,
        price,
        type,
        description,
        image,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert("Update failed");
      return;
    }

    router.replace("/dashboard");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-blue-400 animate-pulse">
          Loading listing...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="max-w-2xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold mb-6">
          Edit Listing
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">

          <input
            className="w-full p-3 rounded bg-white/5 border border-white/10"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full p-3 rounded bg-white/5 border border-white/10"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            className="w-full p-3 rounded bg-white/5 border border-white/10"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <input
            className="w-full p-3 rounded bg-white/5 border border-white/10"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <select
            className="w-full p-3 rounded bg-white/5 border border-white/10"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="billboard">Billboard</option>
            <option value="digital">Digital Screen</option>
            <option value="social">Social Media</option>
          </select>

          <textarea
            className="w-full p-3 rounded bg-white/5 border border-white/10"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button onClick={handleUpdate} disabled={saving}>
            {saving ? "Updating..." : "Update Listing"}
          </Button>

        </div>
      </section>
    </main>
  );
}