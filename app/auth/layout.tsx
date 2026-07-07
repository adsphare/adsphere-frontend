export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4">

      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-[#070b1a] to-[#050816]" />

      {/* OPTIONAL GLOW EFFECT */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,#3b82f6,transparent_60%)]" />

      {/* CONTENT WRAPPER */}
      <div className="relative w-full max-w-md z-10">

        {/* AUTH CARD CONTAINER */}
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur p-6">
          {children}
        </div>

      </div>
    </div>
  );
}






