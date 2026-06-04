import Navbar from "@/components/layout/Navbar";

export default function ListingDetailPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-20">

        <div className="h-[400px] rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-10" />

        <h1 className="text-5xl font-bold mb-4">
          Digital Billboard
        </h1>

        <p className="text-gray-400 text-lg mb-10">
          Premium advertising space with high traffic visibility.
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

            <h2 className="text-xl font-semibold mb-4">
              Stats
            </h2>

            <p>Visibility Score: 92</p>
            <p>Daily Traffic: 48,000</p>
            <p>Trust Score: 95</p>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

            <h2 className="text-xl font-semibold mb-4">
              Price
            </h2>

            <p className="text-3xl font-bold text-blue-400 mb-6">
              $120/day
            </p>

            <button className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition">
              Book Now
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}
