"use client";

import { useEffect } from "react";
import "@/lib/core/bootstrap";

export default function EventProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // bootstrap runs automatically via import side-effects
  }, []);

  return <>{children}</>;
}

