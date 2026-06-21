import { requireAdmin } from "@/lib/admin/requireAdmin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminUsersPage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 text-red-400">
        Failed to load users: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">👤 Users</h1>

      <div className="space-y-3">
        {users?.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between"
          >
            <div>
              <p className="font-semibold">{user.email || "No email"}</p>
              <p className="text-white/40 text-sm">{user.role}</p>
            </div>

            <div className="text-white/40 text-sm">
              {user.created_at}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}