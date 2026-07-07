import { createServerSupabase } from "@/lib/supabase/server";

export const campaignService = {
  async create(input: any) {
    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        brand_id: input.brandId,
        title: input.title,
        description: input.description,
        budget: input.budget,
        status: "pending_payment",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  async getById(id: string) {
    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  async updateStatus(id: string, status: string) {
    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("campaigns")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },
};






