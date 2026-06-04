import { ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        bg-white/5
        border border-white/10
        rounded-2xl
        backdrop-blur-xl
        shadow-lg shadow-black/20
        transition-all duration-300
        hover:bg-white/[0.07]
        hover:scale-[1.01]
        ${className}
      `}
    >
      {children}
    </div>
  );
}

