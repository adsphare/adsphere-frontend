import Link from "next/link";

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050816] text-white px-6">

      <div className="text-center max-w-md">

        {/* LOGO / BRAND */}
        <h1 className="text-4xl font-bold mb-2">
          AdSphera
        </h1>

        <p className="text-white/60 mb-8">
          Connect brands, creators & advertisers in one ecosystem
        </p>

        {/* CARD */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">

          <h2 className="text-xl font-semibold mb-4">
            Welcome
          </h2>

          <p className="text-white/50 text-sm mb-6">
            Choose how you want to continue
          </p>

          {/* ACTIONS */}
          <div className="space-y-3">

            <Link href="/auth/login">
              <button className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition">
                Login
              </button>
            </Link>

            <Link href="/auth/register">
              <button className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 transition">
                Create Account
              </button>
            </Link>

          </div>

        </div>

        {/* FOOTER TEXT */}
        <p className="text-xs text-white/40 mt-6">
          Secure authentication powered by Supabase
        </p>

      </div>

    </main>
  );
}





