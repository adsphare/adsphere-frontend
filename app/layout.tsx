import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050816] text-white antialiased">

        

        {/* PAGE CONTENT */}
        <main className="min-h-screen">
          {children}
        </main>

        

      </body>
    </html>
  );
}