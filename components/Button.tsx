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
      className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 
      ${
        variant === "primary"
          ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30"
          : "bg-white/10 hover:bg-white/20 text-white"
      } ${className}`}
    >
      {children}
    </button>
  );
}
