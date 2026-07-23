import MarketplaceClient from "./MarketplaceClient";
import { getRankedListings } from "@/lib/ranking/getListingsRanked";


export default async function MarketplacePage() {

  const listings =
    await getRankedListings();


  return (
    <main
      className="
      min-h-screen
      bg-[#050816]
      text-white
      "
    >

      <MarketplaceClient
        initialListings={listings}
      />

    </main>
  );
}