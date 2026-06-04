import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

