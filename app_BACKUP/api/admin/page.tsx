import { createServerSupabase } from "@/lib/supabase/server";

/* =========================
   ADMIN CHECK (TEMP)
========================= */
async function requireAdmin() {
  return true;
}

/* =========================
   ADMIN PAGE
========================= */
export default async function AdminPage() {
  await requireAdmin();

  const supabase = createServerSupabase();

  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">

      <h1 className="text-3xl font-bold mb-8">
        Admin Escrow Control Center
      </h1>

      <div className="space-y-4">
        {(!conversations || conversations.length === 0) ? (
          <p className="text-white/40">No active deals</p>
        ) : (
          conversations.map((c: any) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <p className="font-mono text-xs">{c.id}</p>
              <p className="text-white/40 text-sm mt-2">
                Status: {c.status}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

