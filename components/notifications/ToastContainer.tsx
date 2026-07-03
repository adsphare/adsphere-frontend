"use client";

import { useEffect, useState } from "react";
import { toastBus, type Toast } from "@/lib/core/notifications/toast";

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastBus.subscribe((toast) => {
      setToasts((prev) => [toast, ...prev]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="w-80 p-3 rounded-xl shadow-lg bg-[#0b0f1a] border border-white/10"
        >
          <div className="flex items-start gap-2">
            <div className="text-lg">
              {t.type === "chat" && "💬"}
              {t.type === "payment" && "💰"}
              {t.type === "listing" && "📦"}
              {t.type === "system" && "⚙️"}
              {t.type === "trust" && "🛡️"}
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                {t.title}
              </p>

              <p className="text-xs text-white/60">
                {t.message}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}