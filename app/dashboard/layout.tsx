import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#050816] text-white">

      {/* =========================
         SIDEBAR (LEFT)
      ========================= */}
      <aside className="w-64 border-r border-white/10 bg-[#050816]/60 backdrop-blur-md">
        <Sidebar />
      </aside>

      {/* =========================
         MAIN CONTENT AREA
      ========================= */}
      <main className="flex-1 flex flex-col">

        {/* TOP SPACING BAR (SaaS breathing room) */}
        <div className="h-6 border-b border-white/5" />

        {/* CONTENT WRAPPER */}
        <div className="flex-1 px-8 py-8 max-w-7xl w-full">

          {/* PAGE CONTENT */}
          <div className="space-y-6">
            {children}
          </div>

        </div>

      </main>

    </div>
  );
}