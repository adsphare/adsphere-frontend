import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export default function Button({
  children,
  className = "",
  onClick,
  variant = "primary",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3
        rounded-2xl
        font-medium
        transition-all
        duration-300
        hover:scale-105
        ${
          variant === "primary"
            ? `
              bg-gradient-to-r
              from-blue-500
              to-purple-600
              text-white
              shadow-[0_0_40px_rgba(59,130,246,0.35)]
            `
            : `
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              text-white
              hover:bg-white/10
            `
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}