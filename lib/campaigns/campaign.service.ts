import { createServerSupabase } from "@/lib/supabase/server";


export const campaignService = {


  async create(input: {
    brandId: string;
    listingId: string;
    title: string;
    budget: number;
    description?: string;
  }) {

    const supabase =
      await createServerSupabase();


    const { data, error } =
      await supabase
        .from("campaigns")
        .insert({

          brand_id: input.brandId,

          listing_id: input.listingId,

          title: input.title,

          budget: input.budget,

          description:
            input.description ?? "",

          status: "draft",

        })
        .select()
        .single();



    if (error) {
      throw error;
    }


    return data;

  },



  async getById(
    campaignId: string
  ) {

    const supabase =
      await createServerSupabase();


    const { data, error } =
      await supabase
        .from("campaigns")
        .select("*")
        .eq("id", campaignId)
        .single();


    if (error) {
      return null;
    }


    return data;

  },



  async setPendingPayment(
    campaignId: string
  ) {

    const supabase =
      await createServerSupabase();


    const { data, error } =
      await supabase
        .from("campaigns")
        .update({

          status:
            "pending_payment",

        })
        .eq("id", campaignId)
        .select()
        .single();



    if (error) {
      throw error;
    }


    return data;

  },



  async activate(
    campaignId:string
  ) {

    const supabase =
      await createServerSupabase();


    const { data, error } =
      await supabase
        .from("campaigns")
        .update({

          status:
            "active",

          activated_at:
            new Date().toISOString(),

        })
        .eq("id", campaignId)
        .select()
        .single();



    if(error){
      throw error;
    }


    return data;

  },



  async cancel(
    campaignId:string
  ) {

    const supabase =
      await createServerSupabase();


    const { data,error } =
      await supabase
        .from("campaigns")
        .update({

          status:
            "cancelled",

        })
        .eq("id",campaignId)
        .select()
        .single();



    if(error){
      throw error;
    }


    return data;

  },


};
