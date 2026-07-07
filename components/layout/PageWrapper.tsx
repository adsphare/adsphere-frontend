import React from "react";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </main>
  );
}






