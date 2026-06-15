import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#050816] text-white">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/10">
        <Sidebar />
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        <div className="p-6">{children}</div>
      </main>

    </div>
  );
}