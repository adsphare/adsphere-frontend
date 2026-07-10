import { getServerDb } from "@/lib/core/db/serverDb";


export const marketplace = {


  /* =========================
     GET ALL ACTIVE LISTINGS
  ========================= */
  async getActiveListings() {

    const db = await getServerDb();


    const {
      data,
      error
    } = await db
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order(
        "created_at",
        {
          ascending: false
        }
      );


    if(error)
      throw new Error(error.message);


    return data ?? [];

  },



  /* =========================
     GET SINGLE LISTING
  ========================= */
  async getListingById(
    id:string
  ){

    const db = await getServerDb();


    const {
      data,
      error
    } = await db
      .from("listings")
      .select("*")
      .eq("id",id)
      .single();


    if(error)
      throw new Error(error.message);


    return data;

  },



  /* =========================
     CREATE LISTING
  ========================= */
  async createListing(
    payload:any
  ){

    const db = await getServerDb();


    const {
      data,
      error
    } = await db
      .from("listings")
      .insert(payload)
      .select()
      .single();


    if(error)
      throw new Error(error.message);


    return data;

  },



  /* =========================
     TRACK VIEW
  ========================= */
  async trackView(
    listingId:string,
    userId?:string
  ){

    const db = await getServerDb();


    const {
      error
    } = await db
      .from("analytics_events")
      .insert({

        listing_id: listingId,

        user_id: userId ?? null,

        event_type:"view",

        created_at:
          new Date()
          .toISOString()

      });


    if(error)
      throw new Error(error.message);

  }


};
