export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-16">

      <div className="max-w-5xl mx-auto">

        {/* HERO */}
        <h1 className="text-4xl font-bold">
          About AdSphere
        </h1>

        <p className="text-white/60 mt-3 text-lg">
          The next-generation marketplace for advertising space,
          creators, and digital visibility.
        </p>

        {/* DIVIDER */}
        <div className="h-px bg-white/10 my-10" />

        {/* WHAT IT IS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            What is AdSphere?
          </h2>

          <p className="text-white/60 leading-relaxed">
            AdSphere is a unified advertising marketplace where businesses,
            creators, and space owners can buy and sell visibility.
            From social media creators to billboards and digital screens —
            everything becomes a tradable “attention space”.
          </p>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mt-4">

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="font-semibold">1. List Space</h3>
              <p className="text-white/50 text-sm mt-2">
                Users publish advertising space (social, billboard, digital).
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="font-semibold">2. Discover</h3>
              <p className="text-white/50 text-sm mt-2">
                Buyers explore listings with filters and AI recommendations.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="font-semibold">3. Boost & Pay</h3>
              <p className="text-white/50 text-sm mt-2">
                Listings can be boosted for higher visibility using payments.
              </p>
            </div>

          </div>
        </section>

        {/* VISION */}
        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">
            Vision
          </h2>

          <p className="text-white/60 leading-relaxed">
            We are building the world’s first “attention exchange layer”
            where visibility becomes programmable, measurable, and tradable —
            like real estate, but for attention.
          </p>
        </section>

        {/* TRUST BLOCK */}
        <section className="mt-12 p-6 bg-white/5 border border-white/10 rounded-xl">

          <h2 className="text-xl font-semibold">
            Why AdSphere matters
          </h2>

          <ul className="mt-4 space-y-2 text-white/60 text-sm">
            <li>✔ Transparent advertising marketplace</li>
            <li>✔ Direct access between buyers and creators</li>
            <li>✔ AI-powered visibility insights (coming soon)</li>
            <li>✔ Boost-based monetization system</li>
          </ul>

        </section>

      </div>

    </main>
  );
}