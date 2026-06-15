import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition font-medium disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
