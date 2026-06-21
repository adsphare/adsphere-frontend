import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminVerifications() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const { data } = await supabase
    .from("verification_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: 20 }}>
      <h1>🛡 Verification Requests</h1>

      {data?.map((v) => (
        <div key={v.id} style={{ marginBottom: 10 }}>
          <p>User: {v.user_id}</p>
          <p>Type: {v.type}</p>
          <p>Status: {v.status}</p>
        </div>
      ))}
    </div>
  );
}