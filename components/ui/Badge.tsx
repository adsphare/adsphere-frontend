"use client";

export default function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-white/10 text-white/70 border-white/10 " +
        className
      }
    >
      {children}
    </span>
  );
}