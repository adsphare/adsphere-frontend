import React from "react";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </div>
    </main>
  );
}