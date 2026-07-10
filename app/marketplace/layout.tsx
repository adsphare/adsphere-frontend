export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <div
      className="
        min-h-screen
        bg-[#050816]
        text-white
        relative
        overflow-hidden
      "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
          fixed
          inset-0
          -z-10
          bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_60%)]
        "
      />


      <main
        className="
          min-h-screen
          px-6
          py-8
        "
      >

        {children}

      </main>


    </div>

  );

}
