import Link from "next/link";

export default function ListingsPage() {
  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Listings</h1>

        <Link
          href="/list-space"
          className="px-4 py-2 bg-blue-600 rounded-lg"
        >
          Create Listing
        </Link>
      </div>

      <div className="mt-6 grid gap-4">
        {/* placeholder until DB connect */}
        <div className="p-4 bg-white/5 rounded-xl">
          No listings loaded yet
        </div>
      </div>
    </div>
  );
}