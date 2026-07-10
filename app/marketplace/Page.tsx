import {
 getRankedListings
} from "@/lib/core/ranking/getRankedListings";

import type {
 Listing
} from "@/lib/core/ranking/listingRank";
import MarketplaceClient from "./MarketplaceClient";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {

  const listings = await getRankedListings();

  return (
    <MarketplaceClient
      initialListings={listings}
    />
  );
}
