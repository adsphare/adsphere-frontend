import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MyCampaignsPage() {
  // 🔥 IMPORTANT FIX (handles Promise type safely)
  const supabase = await Promise.resolve(
    createServerSupabase()
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h1>My Campaigns</h1>
        <p>Failed to load campaigns: {error.message}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>My Campaigns</h1>

      {campaigns?.length ? (
        campaigns.map((c: any) => (
          <div
            key={c.id}
            style={{
              marginBottom: 16,
              padding: 12,
              border: "1px solid #333",
              borderRadius: 8,
            }}
          >
            <h3>{c.title}</h3>
            <p>Status: {c.status}</p>
            <p>Budget: {c.budget}</p>
          </div>
        ))
      ) : (
        <p>No campaigns found.</p>
      )}
    </div>
  );
}

