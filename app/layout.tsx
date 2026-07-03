import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import EventProvider from "@/components/providers/EventProvider";
import ToastContainer from "@/components/ui/ToastContainer";

import "@/lib/core/notifications/toast-bridge";
import "@/lib/core/bootstrap";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050816] text-white antialiased">

        <div className="fixed inset-0 -z-10 bg-[#050816]" />

        <EventProvider>
          <ToastContainer />
          <Navbar />

          <main className="relative z-10 min-h-screen">
            {children}
          </main>
        </EventProvider>

      </body>
    </html>
  );
}