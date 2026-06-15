export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 text-white/50 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center text-sm">

        <p>© {new Date().getFullYear()} AdSphere</p>

        <div className="flex gap-6">
          <a href="/marketplace" className="hover:text-white">
            Marketplace
          </a>

          <a href="/dashboard" className="hover:text-white">
            Dashboard
          </a>

          <a href="/campaigns" className="hover:text-white">
            Campaigns
          </a>
        </div>

      </div>
    </footer>
  );
}