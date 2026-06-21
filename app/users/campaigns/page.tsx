import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MyCampaignsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id);

  return (
    <div style={{ padding: 20 }}>
      <h1>My Campaigns</h1>

      {campaigns?.map((c) => (
        <div key={c.id}>
          <h3>{c.title}</h3>
          <p>{c.status}</p>
        </div>
      ))}
    </div>
  );
}