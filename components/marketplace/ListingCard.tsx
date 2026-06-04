type Props = {
  title: string;
  location: string;
  price: string;
};

export default function ListingCard({
  title,
  location,
  price,
}: Props) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition">

      <div className="h-40 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-5" />

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="text-gray-400 mt-2">
        {location}
      </p>

      <p className="text-blue-400 mt-4 font-semibold">
        {price}
      </p>

    </div>
  );
}
