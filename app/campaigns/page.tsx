import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CampaignPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: 20 }}>
      <h1>📣 Campaigns</h1>

      <p>Discover active brand campaigns on Adsphare</p>

      <div style={{ marginTop: 20 }}>
        {campaigns?.map((c) => (
          <div key={c.id} style={{ padding: 10, border: "1px solid #333", marginBottom: 10 }}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <p>Budget: {c.budget}</p>
            <p>Status: {c.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}