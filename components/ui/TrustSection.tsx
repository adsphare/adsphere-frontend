export default function TrustSection() {
  return (
    <section className="py-28">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <p className="text-blue-400 uppercase tracking-[0.2em] text-sm mb-4">
            Trust Infrastructure
          </p>

          <h2 className="text-5xl font-bold mb-6">
            Verification First
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            AdSphere protects advertisers, creators and billboard owners
            through verification, trust scoring and fraud prevention.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            <h3 className="text-xl font-semibold mb-4">
              Verified Businesses
            </h3>

            <p className="text-gray-400">
              Registration checks, payment verification and trust scoring.
            </p>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            <h3 className="text-xl font-semibold mb-4">
              Verified Creators
            </h3>

            <p className="text-gray-400">
              Audience authenticity, account ownership and engagement quality.
            </p>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            <h3 className="text-xl font-semibold mb-4">
              Verified Ad Spaces
            </h3>

            <p className="text-gray-400">
              GPS verification, ownership proof and visibility analysis.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
