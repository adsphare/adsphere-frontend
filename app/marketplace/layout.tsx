import Navbar from "@/components/layout/Navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">

      {/* NAVBAR (PUBLIC) */}
      <Navbar />

      {/* BACKGROUND LAYER (STRIPE STYLE GLOW) */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_60%)]" />

      {/* CONTENT */}
      <main className="min-h-screen">
        {children}
      </main>

    </div>
  );
}