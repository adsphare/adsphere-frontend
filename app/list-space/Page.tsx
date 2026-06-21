import { supabase } from "@/lib/supabase";
import ChatButton from "@/components/ChatButton";

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !listing) {
    return (
      <main className="p-10 text-white bg-[#050816] min-h-screen">
        Listing not found
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* HERO IMAGE */}
      <div className="h-[400px] w-full overflow-hidden">
        <img
          src={listing.image || "/placeholder.png"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* TITLE + PRICE */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <p className="text-white/40 mt-1">
              📍 {listing.location}
            </p>
          </div>

          <div className="text-2xl font-bold text-green-400">
            ${listing.price}
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-white/70 leading-relaxed">
          {listing.description}
        </p>

        {/* METRICS (if creator/ad space) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">

          {listing.followers && (
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-white/40">Followers</p>
              <p className="font-semibold">{listing.followers}</p>
            </div>
          )}

          {listing.average_views && (
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-white/40">Avg Views</p>
              <p className="font-semibold">{listing.average_views}</p>
            </div>
          )}

          {listing.engagement_rate && (
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-white/40">Engagement</p>
              <p className="font-semibold">{listing.engagement_rate}%</p>
            </div>
          )}

          {listing.daily_traffic && (
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-white/40">Daily Traffic</p>
              <p className="font-semibold">{listing.daily_traffic}</p>
            </div>
          )}

        </div>

        {/* CHAT CTA */}
        <div className="pt-4">
          <ChatButton listing={listing} />
        </div>

      </div>
    </main>
  );
}