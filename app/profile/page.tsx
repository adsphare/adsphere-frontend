import { supabase } from "@/lib/supabase";

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", params.id);

  if (!profile) {
    return (
      <div className="text-white p-10">Profile not found</div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white p-10">

      {/* PROFILE HEADER */}
      <div className="flex items-center gap-4 mb-8">

        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              className="w-full h-full rounded-full"
            />
          ) : (
            <span>👤</span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {profile.username}

            {profile.verified && (
              <span className="text-blue-400 text-sm">✔ Verified</span>
            )}
          </h1>

          <p className="text-white/40 text-sm">
            Trust Score: {profile.trust_score}
          </p>
        </div>
      </div>

      {/* BIO */}
      <p className="text-white/70 mb-6">
        {profile.bio || "No bio yet"}
      </p>

      {/* LISTINGS */}
      <h2 className="text-xl font-semibold mb-4">
        Listings
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        {listings?.map((l) => (
          <div
            key={l.id}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <h3 className="font-semibold">{l.title}</h3>
            <p className="text-white/40 text-sm">
              {l.location}
            </p>
            <p className="text-blue-400">{l.price}</p>
          </div>
        ))}

      </div>
    </main>
  );
}