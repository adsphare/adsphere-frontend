import React from "react";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
};

export default function Container({
  children,
  className = "",
  size = "xl",
}: ContainerProps) {
  const sizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={`
        w-full mx-auto px-6
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}