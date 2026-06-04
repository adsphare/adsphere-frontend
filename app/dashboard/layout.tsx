import Sidebar from "@/components/sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex">

      <Sidebar />

      <main className="flex-1 p-6 md:p-10">

        <Topbar />

        {children}

      </main>

    </div>
  );
}

