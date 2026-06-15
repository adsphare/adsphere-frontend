import Link from "next/link";

type Props = {
  space: any;
};

export default function SpaceCard({ space }: Props) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition">

      {/* TITLE */}
      <h3 className="text-lg font-semibold">
        {space?.title || "Untitled Space"}
      </h3>

      {/* LOCATION */}
      <p className="text-sm text-gray-400 mt-1">
        {space?.location || "No location"}
      </p>

      {/* PRICE */}
      <p className="text-blue-400 font-bold mt-2">
        ${space?.price || 0}
      </p>

      {/* ACTION */}
      <Link
        href={`/marketplace/${space?.id}`}
        className="inline-block mt-4 text-sm text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded"
      >
        View Details
      </Link>

    </div>
  );
}