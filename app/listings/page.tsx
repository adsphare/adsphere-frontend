"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Listing = {
  id: string;
  title: string;
  location: string;
  price: number | null;
  description: string | null;
  created_at: string;
};

export default function ListingsPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setListings((data as Listing[]) || []);
    setLoading(false);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function createListing() {
    setError(null);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("Please login first");
      return;
    }

    const { error } = await supabase.from("listings").insert({
      title: form.title,
      location: form.location,
      price: form.price ? Number(form.price) : null,
      description: form.description,
      user_id: user.id,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setForm({
      title: "",
      location: "",
      price: "",
      description: "",
    });

    setOpen(false);
    loadListings();
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Listings</h1>

        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 bg-blue-600 rounded-lg"
        >
          + Create Listing
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded">
          {error}
        </div>
      )}

      {/* FORM */}
      {open && (
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">

          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 bg-black/40 rounded"
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 bg-black/40 rounded"
          />

          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 bg-black/40 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 bg-black/40 rounded"
          />

          <div className="flex gap-3">
            <button
              onClick={createListing}
              className="px-4 py-2 bg-green-600 rounded-lg"
            >
              Create
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

      {/* LISTINGS */}
      {loading ? (
        <p className="text-white/50">Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-white/40">No listings found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {listings.map((l) => (
            <div
              key={l.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <h2 className="font-semibold">{l.title}</h2>

              <p className="text-white/50 text-sm mt-1">
                📍 {l.location}
              </p>

              <p className="text-blue-400 mt-2">
                {l.price ? `$${l.price}` : "No price"}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.push(`/listings/${l.id}`)}
                  className="flex-1 px-3 py-2 bg-white/10 rounded"
                >
                  View
                </button>

                <button
                  onClick={() =>
                    router.push(`/messages/new?listing=${l.id}`)
                  }
                  className="flex-1 px-3 py-2 bg-blue-600 rounded"
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
