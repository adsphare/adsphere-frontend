
import type { Listing } from "./types";

import {
  createListing,
  deleteListing,
  getListingById,
  getListings,
  updateListing,
} from "./repository";

import {
  validateListing,
  type CreateListingInput,
} from "./validation";

/* =========================================
   GET ALL LISTINGS
========================================= */

export async function fetchListings(): Promise<Listing[]> {
  return await getListings();
}

/* =========================================
   GET SINGLE LISTING
========================================= */

export async function fetchListing(
  id: string
): Promise<Listing | null> {
  return await getListingById(id);
}

/* =========================================
   CREATE LISTING
========================================= */

export async function createNewListing(
  input: CreateListingInput & {
    user_id: string;
    currency?: string;
  }
): Promise<Listing> {
  console.log(
    "CREATE LISTING INPUT:",
    JSON.stringify(input, null, 2)
  );

  const errors = validateListing(input);

  if (errors.length > 0) {
    console.log(
      "LISTING VALIDATION ERRORS:",
      errors
    );

    throw new Error(
      errors.join("\n")
    );
  }

  const listing = await createListing({
    user_id: input.user_id,

    title: input.title,

    description:
      input.description ?? "",

    location:
      input.location,

    type:
      input.type,

    price:
      input.price,

    currency:
      input.currency ?? "ETB",

    status:
      "active",

    /*
     * Boost fields are initialized only when
     * the listing is created.
     *
     * They are not editable through editListing().
     */
    boost_score:
      0,

    boost_views:
      0,

    boost_clicks:
      0,

    boosted:
      false,

    created_at:
      new Date().toISOString(),
  });

  console.log(
    "CREATED LISTING:",
    listing
  );

  return listing;
}

/* =========================================
   UPDATE LISTING
========================================= */

/*
 * Only ordinary listing content is editable.
 *
 * Explicitly excluded from this service:
 *
 * - boost_score
 * - boosted
 * - boost_expires_at
 * - boost_plan
 * - boost_provider
 *
 * Promotion state must come from the canonical
 * payment / boost settlement flow.
 */

export type EditableListingUpdates = {
  title?: Listing["title"];
  description?: Listing["description"];
  location?: Listing["location"];
  type?: Listing["type"];
  price?: Listing["price"];
  currency?: Listing["currency"];
};

export async function editListing(
  id: string,
  updates: EditableListingUpdates
): Promise<Listing> {
  const safeUpdates: EditableListingUpdates = {
    title: updates.title,
    description: updates.description,
    location: updates.location,
    type: updates.type,
    price: updates.price,
    currency: updates.currency,
  };

  return await updateListing(
    id,
    safeUpdates
  );
}

/* =========================================
   DELETE LISTING
========================================= */

export async function removeListing(
  id: string
): Promise<void> {
  await deleteListing(id);
}

