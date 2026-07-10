import { createServerSupabase } from "@/lib/supabase/server";

import {
  rankListing,
} from "./listingRank";

import type {
  Listing,
} from "@/lib/listings/types";


export async function getRankedListings() {

  console.log("RANKING FUNCTION START");


  const supabase =
    await createServerSupabase();


  console.log("SUPABASE CLIENT CREATED");


  const {
    data,
    error,
  } = await supabase
    .from("listings")
    .select(
      `
      id,
      user_id,
      title,
      location,
      created_at,
      boost_score,
      boost_views,
      boost_clicks
      `
    );


  console.log(
    "LISTINGS DATA:",
    data
  );


  if (error) {

    console.log(
      "SUPABASE ERROR:",
      error
    );

    throw new Error(error.message);

  }


  const ranked =
    (data ?? []).map((item) => {


      const listing: Listing = {

        id: item.id,

        user_id: item.user_id,

        title: item.title,

        location: item.location,

        created_at: item.created_at,


        boost_score:
          item.boost_score ?? 0,


        boost_views:
          item.boost_views ?? 0,


        boost_clicks:
          item.boost_clicks ?? 0,

      };


      return {

        ...listing,

        rank:
          rankListing(listing),

      };

    });



  console.log(
    "RANKED RESULT:",
    ranked
  );


  return ranked.sort(
    (a, b) =>
      b.rank - a.rank
  );

}
