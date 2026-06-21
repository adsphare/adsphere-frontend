"use client";

type FeatureCardProps = {
  title: string;
  description: string;
};

export default function FeatureCard({
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:border-blue-500/40 hover:bg-white/10">

      {/* Glow background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />

      {/* Icon */}
      <div className="relative z-10 w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-105 transition">
        <div className="w-6 h-6 rounded-full bg-blue-500" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-3 text-white">
          {title}
        </h3>

        <p className="text-white/50 leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}