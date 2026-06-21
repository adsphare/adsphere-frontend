import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050816] text-white/60">

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* =========================
           TOP GRID
        ========================= */}
        <div className="grid md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
            <h2 className="text-white font-semibold text-lg">
              Adsphere
            </h2>

            <p className="text-sm text-white/40 mt-3 leading-relaxed">
              Visibility Infrastructure Network connecting creators,
              advertisers, and real-world spaces.
            </p>
          </div>

          {/* PLATFORM */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">
              Platform
            </h3>

            <div className="space-y-2 text-sm">
              <Link href="/marketplace" className="block hover:text-white transition">
                Marketplace
              </Link>

              <Link href="/list-space" className="block hover:text-white transition">
                List Space
              </Link>

              <Link href="/dashboard" className="block hover:text-white transition">
                Dashboard
              </Link>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">
              Company
            </h3>

            <div className="space-y-2 text-sm">
              <Link href="/" className="block hover:text-white transition">
                Home
              </Link>

              <Link href="/" className="block hover:text-white transition">
                About
              </Link>

              <Link href="/" className="block hover:text-white transition">
                Contact
              </Link>
            </div>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">
              Legal
            </h3>

            <div className="space-y-2 text-sm">
              <Link href="/" className="block hover:text-white transition">
                Privacy Policy
              </Link>

              <Link href="/" className="block hover:text-white transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* =========================
           BOTTOM BAR
        ========================= */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Adsphere. All rights reserved.
          </p>

          <p className="text-xs text-white/30">
            Built for visibility, not vanity.
          </p>

        </div>

      </div>
    </footer>
  );
}