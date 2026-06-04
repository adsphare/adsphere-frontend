"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { store } from "@/lib/store";
import { getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function ListSpacePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    const user = getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    const newListing = {
      id: Date.now().toString(),
      userId: user.id,
      title,
      location,
      price,
      type: "billboard",
      description,
    };

    store.addListing(newListing);

    router.push("/marketplace");
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-20">

        <h1 className="text-4xl font-bold mb-8">
          Create Listing
        </h1>

        <div className="space-y-4">

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10"
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10"
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 h-32 rounded-xl bg-white/5 border border-white/10"
          />

          <Button onClick={handleSubmit}>
            Publish Listing
          </Button>

        </div>

      </section>

    </main>
  );
}