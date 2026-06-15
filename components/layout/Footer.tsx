"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#050816] text-gray-400 mt-20">
      
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">

        {/* BRAND */}
        <div>
          <h2 className="text-white text-xl font-bold mb-3">
            AdSphere 🚀
          </h2>
          <p className="text-sm">
            The future of advertising — digital + physical ad marketplace.
          </p>
        </div>

        {/* PLATFORM */}
        <div>
          <h3 className="text-white font-semibold mb-3">Platform</h3>
          <div className="space-y-2 text-sm">
            <Link href="/marketplace" className="hover:text-white">
              Marketplace
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/dashboard/campaigns" className="hover:text-white">
              Campaigns
            </Link>
            <Link href="/dashboard/analytics" className="hover:text-white">
              Analytics
            </Link>
          </div>
        </div>

        {/* MONETIZATION */}
        <div>
          <h3 className="text-white font-semibold mb-3">Monetization</h3>
          <div className="space-y-2 text-sm">
            <Link href="/dashboard/boost" className="hover:text-white">
              Boost Listings
            </Link>
            <Link href="/dashboard/campaigns" className="hover:text-white">
              Ad Campaigns
            </Link>
            <Link href="/dashboard/settings" className="hover:text-white">
              Payments
            </Link>
          </div>
        </div>

        {/* ACCOUNT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Account</h3>
          <div className="space-y-2 text-sm">
            <Link href="/login" className="hover:text-white">
              Login
            </Link>
            <Link href="/dashboard/settings" className="hover:text-white">
              Settings
            </Link>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 text-center py-4 text-xs">
        © {new Date().getFullYear()} AdSphere. All rights reserved.
      </div>

    </footer>
  );
}