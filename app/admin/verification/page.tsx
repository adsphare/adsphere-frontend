import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminVerifications() {
  const supabase = await createServerSupabase();

  /* =========================
     AUTH CHECK
  ========================= */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  /* =========================
     ROLE CHECK
  ========================= */
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile error:", profileError.message);
    redirect("/");
  }

  if (profile?.role !== "admin") redirect("/");

  /* =========================
     FETCH DATA
  ========================= */
  const { data, error } = await supabase
    .from("verification_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Verification fetch error:", error.message);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🛡 Verification Requests</h1>

      {!data || data.length === 0 ? (
        <p>No verification requests</p>
      ) : (
        data.map((v) => (
          <div key={v.id} style={{ marginBottom: 10 }}>
            <p>User: {v.user_id}</p>
            <p>Type: {v.type}</p>
            <p>Status: {v.status}</p>
          </div>
        ))
      )}
    </div>
  );
}





