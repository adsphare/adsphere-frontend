type Listing = {
  id?: string;
  title: string;
  location: string;
  price?: number;
  type?: string;
};

type CardProps = {
  item: Listing;
  onClick?: () => void;
};

export default function Card({ item, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
    >
      <h2 className="text-lg font-semibold">{item.title}</h2>

      <p className="text-white/40 text-sm mt-1">
        📍 {item.location}
      </p>

      {item.price && (
        <p className="text-green-400 mt-2 font-medium">
          ${item.price}
        </p>
      )}

      {item.type && (
        <p className="text-xs text-white/30 mt-1">
          {item.type}
        </p>
      )}
    </div>
  );
}

