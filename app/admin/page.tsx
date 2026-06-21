import { requireAdmin } from "@/lib/admin/requireAdmin";

export default async function AdminPage() {
  await requireAdmin(); // 🔒 Protect admin route

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-white/50 mt-1">
          Manage your platform: users, listings, boosts, and verifications
        </p>
      </div>

      {/* GRID CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* USERS */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <h2 className="text-xl font-semibold">👤 Users</h2>
          <p className="text-white/50 mt-2">
            Manage user accounts, roles, and bans
          </p>
        </div>

        {/* LISTINGS */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <h2 className="text-xl font-semibold">📦 Listings</h2>
          <p className="text-white/50 mt-2">
            Approve, reject, or manage marketplace listings
          </p>
        </div>

        {/* BOOSTS */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <h2 className="text-xl font-semibold">🚀 Boosts</h2>
          <p className="text-white/50 mt-2">
            Monitor active boosts and payment status
          </p>
        </div>

        {/* VERIFICATIONS */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <h2 className="text-xl font-semibold">🛡 Verifications</h2>
          <p className="text-white/50 mt-2">
            Verify creators, brands, and advertisers
          </p>
        </div>

      </div>
    </div>
  );
}