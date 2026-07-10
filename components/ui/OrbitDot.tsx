"use client";

export default function OrbitDot({
  className,
}: {
  className: string;
}) {
  return (
    <div
      className={`
        absolute
        ${className}
        w-2.5
        h-2.5
        rounded-full
        bg-blue-400
        shadow-[0_0_18px_rgba(59,130,246,0.85)]
      `}
    />
  );
}