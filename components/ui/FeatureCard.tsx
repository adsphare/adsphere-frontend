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

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition duration-500" />

      {/* Icon */}
      <div className="relative z-10 w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
        <div className="w-6 h-6 rounded-full bg-blue-500" />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-3">
          {title}
        </h3>

        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
