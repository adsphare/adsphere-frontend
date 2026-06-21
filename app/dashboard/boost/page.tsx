"use client";

import { useState } from "react";
import BoostButton from "@/components/BoostButton";
import PaymentModal from "@/components/PaymentModal";
import { supabase } from "@/lib/supabase";

export default function BoostPage() {
  const [open, setOpen] = useState(false);

  // real user + listing should come from DB in your app
  const listingId = "demo-listing-id";
  const userId = "demo-user-id";

  return (
    <main className="min-h-screen bg-[#050816] text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Boost Center 🚀</h1>

      <BoostButton onClick={() => setOpen(true)} />

      <PaymentModal
        open={open}
        onClose={() => setOpen(false)}
        listingId={listingId}
        userId={userId}
      />
    </main>
  );
}