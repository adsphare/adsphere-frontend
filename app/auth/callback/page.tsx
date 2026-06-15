"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth/login");
      }
    };

    run();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Completing login...
    </div>
  );
}