import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition duration-200 focus:outline-none";

  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20",
    secondary:
      "bg-white/5 text-white border border-white/10 hover:bg-white/10",
    ghost:
      "text-white/60 hover:text-white hover:bg-white/5",
    danger:
      "bg-red-600 text-white hover:bg-red-500",
  };

  const styles = `
    ${base}
    ${sizes[size]}
    ${variants[variant]}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  // If it's a link-style button
  if (href) {
    return (
      <a href={href} className={styles}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={styles}>
      {children}
    </button>
  );
}