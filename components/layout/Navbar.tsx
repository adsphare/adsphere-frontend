"use client";

import Button from "@/components/ui/Button";
import { getUser, logout } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="w-full border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <h1 className="text-xl font-bold">
          Ad<span className="text-blue-500">Sphere</span>
        </h1>

        <nav className="flex items-center gap-6 text-sm text-gray-300">
          <a href="/marketplace">Marketplace</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/list-space">Create</a>
        </nav>

        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <Button onClick={() => router.push("/login")}>
              Login
            </Button>
          )}
        </div>

      </div>
    </header>
  );
}