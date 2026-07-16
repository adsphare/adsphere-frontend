import { createServerSupabase } from "@/lib/supabase/server";


export const notification = {

  async create({
    userId,
    title,
    message,
    type = "system",
    data = {},
  }: {
    userId: string;
    title: string;
    message: string;
    type?: "chat" | "system" | "payment" | "listing";
    data?: any;
  }) {

    const supabase = await createServerSupabase();


    const { data: result, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        message,
        type,
        data,
        read:false,
        created_at:new Date().toISOString(),
      })
      .select()
      .single();


    if(error){
      throw new Error(error.message);
    }


    return result;
  },


  async getUserNotifications(userId:string){

    const supabase = await createServerSupabase();


    const {data,error}=await supabase
      .from("notifications")
      .select("*")
      .eq("user_id",userId)
      .order("created_at",{
        ascending:false,
      });


    if(error){
      throw new Error(error.message);
    }


    return data ?? [];
  },


  async markAsRead(notificationId:string){

    const supabase = await createServerSupabase();


    const {error}=await supabase
      .from("notifications")
      .update({
        read:true,
      })
      .eq("id",notificationId);


    if(error){
      throw new Error(error.message);
    }
  },


  async markAllAsRead(userId:string){

    const supabase = await createServerSupabase();


    const {error}=await supabase
      .from("notifications")
      .update({
        read:true,
      })
      .eq("user_id",userId)
      .eq("read",false);


    if(error){
      throw new Error(error.message);
    }
  },

};