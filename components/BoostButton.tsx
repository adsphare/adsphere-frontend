"use client";

import { useState } from "react";
import BoostModal from "@/components/BoostModal";

type Props = {
  listingId: string;
};

export default function BoostButton({ listingId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
      >
        🚀 Boost
      </button>

      <BoostModal
        open={open}
        onClose={() => setOpen(false)}
        listingId={listingId}
      />
    </>
  );
}