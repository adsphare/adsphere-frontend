"use client";

type Listing = {
  id: string;
  title: string;
  location: string;
  price: string;
  type?: string;
  image?: string;
  views?: number;
};

type CardProps = {
  item: Listing;
  variant?: "small" | "medium" | "large" | "hero";
};

export default function Card({ item, variant = "small" }: CardProps) {
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition relative group">

      {/* IMAGE */}
      <div
        className={`
          relative overflow-hidden bg-black

          ${variant === "hero" ? "h-[420px]" : ""}
          ${variant === "large" ? "h-[300px]" : ""}
          ${variant === "medium" ? "h-[220px]" : ""}
          ${variant === "small" ? "h-[180px]" : ""}
        `}
      >
        {item.image ? (
          <img
            src={item.image}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-white/20">
            No Image
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-white">
          {item.title}
        </h3>

        <p className="text-white/40 text-xs">
          📍 {item.location}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-blue-400 font-semibold">
            {item.price}
          </span>

          <span className="text-white/30 text-xs">
            {item.type}
          </span>
        </div>
      </div>

    </div>
  );
}