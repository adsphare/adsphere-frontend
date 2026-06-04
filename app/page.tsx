import Navbar from "@/components/layout/Navbar";

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-bold mb-6">
          Marketplace
        </h1>

        <p className="text-gray-400 mb-12">
          Discover billboards, creators, publishers,
          and advertising opportunities worldwide.
        </p>

        <input
          type="text"
          placeholder="Search ad spaces..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 mb-10"
        />

        <div className="flex flex-wrap gap-4 mb-12">

          <button className="px-5 py-3 rounded-xl bg-blue-600">
            Billboards
          </button>

          <button className="px-5 py-3 rounded-xl bg-white/5">
            Creators
          </button>

          <button className="px-5 py-3 rounded-xl bg-white/5">
            Publishers
          </button>

          <button className="px-5 py-3 rounded-xl bg-white/5">
            Digital Screens
          </button>

        </div>

      </section>

    </main>
  );
}
