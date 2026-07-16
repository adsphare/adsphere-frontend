import { createServerSupabase } from "@/lib/supabase/server";


export const profileService = {


  async getProfile(userId:string){

    const supabase = await createServerSupabase();


    const {data,error}=await supabase
      .from("profiles")
      .select("*")
      .eq("id",userId)
      .single();


    if(error){
      throw new Error(error.message);
    }


    return data;
  },


  async createProfile({
    userId,
    fullName,
    role="user",
  }:{
    userId:string;
    fullName?:string;
    role?:string;
  }){


    const supabase = await createServerSupabase();


    const {data,error}=await supabase
      .from("profiles")
      .insert({
        id:userId,
        full_name:fullName ?? "",
        role,
        created_at:new Date().toISOString(),
        updated_at:new Date().toISOString(),
      })
      .select()
      .single();


    if(error){
      throw new Error(error.message);
    }


    return data;
  },


  async updateProfile(
    userId:string,
    updates:Record<string,any>
  ){

    const supabase = await createServerSupabase();


    const {data,error}=await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at:new Date().toISOString(),
      })
      .eq("id",userId)
      .select()
      .single();


    if(error){
      throw new Error(error.message);
    }


    return data;
  },


  async deleteProfile(userId:string){

    const supabase = await createServerSupabase();


    const {error}=await supabase
      .from("profiles")
      .delete()
      .eq("id",userId);


    if(error){
      throw new Error(error.message);
    }


    return true;
  },


  async exists(userId:string){

    const supabase = await createServerSupabase();


    const {data,error}=await supabase
      .from("profiles")
      .select("id")
      .eq("id",userId)
      .maybeSingle();


    if(error){
      throw new Error(error.message);
    }


    return Boolean(data);
  },

};