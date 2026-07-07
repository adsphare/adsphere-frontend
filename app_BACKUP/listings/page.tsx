"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Listing = {
  id: string;
  title: string;
  location: string;
  price: string;
  description?: string;
};

export default function ListingsPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase(); // ✅ FIX

  const [listings, setListings] = useState<Listing[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setFetching(true);
    setError(null);

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
      setFetching(false);
      return;
    }

    setListings(data ?? []);
    setFetching(false);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function createListing() {
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("listings").insert({
      title: form.title,
      location: form.location,
      price: form.price,
      description: form.description,
      user_id: user.id,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setOpen(false);
    setForm({
      title: "",
      location: "",
      price: "",
      description: "",
    });

    await fetchListings();
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white p-8">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Listings</h1>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 rounded-lg"
        >
          + Create Listing
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded">
          {error}
        </div>
      )}

      {open && (
        <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">

          <input
            name="title"
            placeholder="Title"
            className="w-full p-2 bg-black/40 rounded"
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Location"
            className="w-full p-2 bg-black/40 rounded"
            onChange={handleChange}
          />

          <input
            name="price"
            placeholder="Price"
            className="w-full p-2 bg-black/40 rounded"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-2 bg-black/40 rounded"
            onChange={handleChange}
          />

          <div className="flex gap-3">

            <button
              onClick={createListing}
              disabled={loading}
              className="px-4 py-2 bg-green-600 rounded-lg"
            >
              {loading ? "Creating..." : "Create"}
            </button>

            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-white/10 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      {fetching ? (
        <p className="text-white/40">Loading listings...</p>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold">No listings yet</h2>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">

          {listings.map((l) => (
            <div
              key={l.id}
              className="p-4 border border-white/10 rounded-xl bg-white/5"
            >
              <h2 className="font-semibold">{l.title}</h2>

              <p className="text-white/40 text-sm mt-1">
                📍 {l.location}
              </p>

              <p className="text-blue-400 mt-2">
                {l.price}
              </p>

              <div className="flex gap-2 mt-4">

                <button
                  onClick={() => router.push(`/listings/${l.id}`)}
                  className="flex-1 px-3 py-2 bg-white/10 rounded-lg"
                >
                  View
                </button>

                <button
                  onClick={() =>
                    router.push(`/messages/new?listing=${l.id}`)
                  }
                  className="flex-1 px-3 py-2 bg-blue-600 rounded-lg"
                >
                  💬 Chat
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}

