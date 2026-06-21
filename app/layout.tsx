import "../globals.css";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050816] text-white antialiased">

        {/* GLOBAL BACKGROUND */}
        <div className="fixed inset-0 -z-10 bg-[#050816]" />

        {/* NAVBAR (GLOBAL) */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="min-h-screen">
          {children}
        </main>

      </body>
    </html>
  );
}