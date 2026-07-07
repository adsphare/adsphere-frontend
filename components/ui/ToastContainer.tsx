"use client";

import { useEffect, useState } from "react";
import { toastBus } from "@/lib/core/notifications/toast";

type Toast = {
  id: string;
  title: string;
  message: string;
  type: string;
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastBus.on((toast) => {
      setToasts((prev) => [toast, ...prev]);

      // auto remove after 4s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-[#0b0f1a] border border-white/10 px-4 py-3 rounded-xl shadow-xl w-72 animate-in slide-in-from-right"
        >
          <p className="text-sm font-semibold">{t.title}</p>
          <p className="text-xs text-white/60">{t.message}</p>
        </div>
      ))}
    </div>
  );
}

