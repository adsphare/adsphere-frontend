import { useEffect } from "react";
import { presence } from "./index";

export function usePresence(userId: string | null) {
  useEffect(() => {
    if (!userId) return;

    // set online immediately
    presence.setOnline(userId);

    // heartbeat every 30s
    const interval = setInterval(() => {
      presence.heartbeat(userId);
    }, 30000);

    // set offline on tab close
    const handleOffline = () => {
      presence.setOffline(userId);
    };

    window.addEventListener("beforeunload", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleOffline);
      presence.setOffline(userId);
    };
  }, [userId]);
}