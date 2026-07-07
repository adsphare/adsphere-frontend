import ChatButton from "@/components/ChatButton";
import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

type Listing = {
  id: string;
  title: string;
  location: string;
  type?: string;
  price?: number;
  description?: string;
  images?: string[];
  metadata?: any;
  user_id: string;
};

export default async function MarketplaceDetailPage({ params }: Props) {
  const supabase = createServerSupabase();

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !listing) {
    notFound();
  }

  const image = listing?.images?.[0];

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* HERO IMAGE */}
      <div className="h-[420px] w-full bg-black overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/30">
            No Image Available
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{listing.title}</h1>

            <p className="text-white/40 mt-1">
              📍 {listing.location}
            </p>

            <p className="text-sm text-white/30 mt-1">
              Type: {listing.type || "N/A"}
            </p>
          </div>

          <div className="text-2xl font-bold text-green-400">
            ${listing.price ?? 0}
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-white/70 leading-relaxed">
          {listing.description || "No description available."}
        </p>

        {/* METADATA */}
        {listing.metadata && (
          <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Details</h3>

            <pre className="text-white/60 text-sm overflow-auto">
              {JSON.stringify(listing.metadata, null, 2)}
            </pre>
          </div>
        )}

        {/* CHAT */}
        <div className="pt-6 border-t border-white/10">
          <ChatButton
            listing={{
              id: listing.id,
              user_id: listing.user_id,
            }}
          />
        </div>

      </div>
    </main>
  );
}