import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050816] text-white antialiased">

        {/* GLOBAL BACKGROUND LAYER */}
        <div className="fixed inset-0 -z-10 bg-[#050816]" />

        {/* GLOBAL NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="relative z-10 min-h-screen">
          {children}
        </main>

      </body>
    </html>
  );
}