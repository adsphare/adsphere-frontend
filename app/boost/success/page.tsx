"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/marketplace");
    }, 2000);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-white">
      Boost activated 🚀 Redirecting...
    </div>
  );
}
