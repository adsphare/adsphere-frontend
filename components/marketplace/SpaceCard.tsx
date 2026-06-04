"use client";

import { useRouter } from "next/navigation";

type Props = {
  id: string;
  title: string;
  location: string;
  price: string;
};

export default function SpaceCard({
  id,
  title,
  location,
  price,
}: Props) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/marketplace/${id}`)}
      className="cursor-pointer bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300"
    >
      {/* Image Placeholder */}
      <div className="h-40 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-6" />

      {/* Title */}
      <h3 className="text-xl font-semibold">{title}</h3>

      {/* Location */}
      <p className="text-gray-400 text-sm mt-2">{location}</p>

      {/* Price */}
      <p className="text-blue-400 mt-4 font-semibold">{price}</p>
    </div>
  );
}