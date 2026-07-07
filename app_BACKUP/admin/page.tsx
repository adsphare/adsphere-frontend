import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

/* =========================
   TYPES
========================= */
type Profile = {
  role: string;
};

type Conversation = {
  id: string;
  status: string;
  escrow_status?: "locked" | "released" | null;
  created_at?: string;
};

/* =========================
   ADMIN CHECK
========================= */
async function requireAdmin(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    console.error("Profile error:", error?.message);
    redirect("/");
  }

  if (profile.role !== "admin") {
    redirect("/");
  }

  return user;
}

/* =========================
   PAGE
========================= */
export default async function AdminPage() {
  // ✅ CORRECT: single SSR Supabase instance
  const supabase = createServerSupabase();

  // ✅ admin guard
  await requireAdmin(supabase);

  // ✅ fetch data
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Conversation error:", error.message);

    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Failed to load conversations
          </h1>
          <p className="text-white/50 mt-2">
            Please try again later.
          </p>
        </div>
      </main>
    );
  }

  const safeConversations: Conversation[] = conversations ?? [];

  return (
    <main className="min-h-screen bg-[#050816] text-white p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Admin Escrow Control Center
        </h1>
        <p className="text-white/50 mt-1">
          Manage users, listings, boosts, and escrow flows
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">
          💰 Active Escrow Deals
        </h2>

        {safeConversations.length === 0 ? (
          <p className="text-white/40">No active deals</p>
        ) : (
          safeConversations.map((conversation) => (
            <div
              key={conversation.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm text-white/50">
                    Conversation ID
                  </p>
                  <p className="font-mono text-xs">
                    {conversation.id}
                  </p>
                </div>

                <div>
                  {conversation.escrow_status === "locked" && (
                    <span className="px-3 py-1 rounded bg-yellow-500 text-black text-xs">
                      🔒 Locked
                    </span>
                  )}

                  {conversation.escrow_status === "released" && (
                    <span className="px-3 py-1 rounded bg-green-500 text-black text-xs">
                      💰 Released
                    </span>
                  )}

                  {!conversation.escrow_status && (
                    <span className="px-3 py-1 rounded bg-gray-500 text-black text-xs">
                      Unknown
                    </span>
                  )}
                </div>

              </div>

              <p className="text-white/40 text-sm mt-3">
                Status: {conversation.status}
              </p>
            </div>
          ))
        )}
      </div>

      {/* MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        <AdminCard title="👤 Users" desc="Manage user accounts, roles and bans" />
        <AdminCard title="📦 Listings" desc="Approve or remove listings" />
        <AdminCard title="🚀 Boosts" desc="Monitor paid boosts" />
        <AdminCard title="🛡 Verifications" desc="Verify creators and brands" />

      </div>

    </main>
  );
}

/* =========================
   ADMIN CARD
========================= */
function AdminCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-white/50 mt-2">{desc}</p>
    </div>
  );
}

