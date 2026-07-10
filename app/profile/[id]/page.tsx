import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default async function ProfilePage({ params }: Props) {
  const { id } = params;

  const supabase = await createServerSupabase();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", id);

  return (
    <main className="min-h-screen bg-[#050816] text-white p-10">

      {/* PROFILE HEADER */}
      <div className="flex items-center gap-4 mb-8">

        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>👤</span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            {profile.username || "Unknown User"}
          </h1>

          {profile.verified && (
            <p className="text-blue-400 text-sm">✔ Verified</p>
          )}

          <p className="text-white/40 text-sm">
            Trust Score: {profile.trust_score || 0}
          </p>
        </div>

      </div>

      {/* BIO */}
      <p className="text-white/70 mb-8">
        {profile.bio || "No bio available"}
      </p>

      {/* LISTINGS */}
      <h2 className="text-xl font-semibold mb-4">
        Listings
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        {(listings ?? []).map((l: any) => (
          <div
            key={l.id}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >

            <h3 className="font-semibold text-lg">
              {l.title || "Untitled"}
            </h3>

            <p className="text-sm text-white/60 mt-1">
              {l.description || "No description"}
            </p>

            <div className="mt-3 text-sm text-blue-400">
              ${l.price || 0}
            </div>

          </div>
        ))}

      </div>

    </main>
  );
}
