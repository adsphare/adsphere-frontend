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


  const errors =
    validateListing(input);



  if (errors.length > 0) {

    console.log(
      "LISTING VALIDATION ERRORS:",
      errors
    );

    throw new Error(
      errors.join("\n")
    );

  }



  const listing =
    await createListing({

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

export async function editListing(
  id: string,
  updates: Partial<Listing>
): Promise<Listing> {

  return await updateListing(
    id,
    updates
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