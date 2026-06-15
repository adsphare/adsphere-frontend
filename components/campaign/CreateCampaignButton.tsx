"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import PaymentModal from "./PaymentModal";

type PaymentMethod = "chapa" | "stripe";

interface Props {
  listingId: string;
}

export default function CreateCampaignButton({ listingId }: Props) {
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  async function createCampaign(method: PaymentMethod) {
    setLoading(true);
    setShowPaymentModal(false);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      const { data: campaign, error } = await supabase
        .from("campaigns")
        .insert({
          user_id: user.id,
          listing_id: listingId,
          title: "Boost Campaign",
          budget: 10,
          status: "pending",
          payment_status: "pending",
          payment_method: method,
        })
        .select()
        .single();

      if (error || !campaign) {
        console.log(error);
        alert("Failed to create campaign");
        setLoading(false);
        return;
      }

      // CHAPA
      if (method === "chapa") {
        const res = await fetch("/api/chapa/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignId: campaign.id,
            amount: 10,
            email: user.email,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.checkout_url) {
          alert("Chapa payment failed");
          setLoading(false);
          return;
        }

        window.location.href = data.checkout_url;
        return;
      }

      // STRIPE
      if (method === "stripe") {
        const res = await fetch("/api/stripe/campaign-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignId: campaign.id,
            listingId,
            budget: 10,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.url) {
          alert("Stripe checkout failed");
          setLoading(false);
          return;
        }

        window.location.href = data.url;
        return;
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setShowPaymentModal(true)}
        disabled={loading}
        className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-500 transition"
      >
        {loading ? "Processing..." : "🚀 Boost Campaign"}
      </button>

      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelect={(method) => createCampaign(method)}
      />
    </>
  );
}