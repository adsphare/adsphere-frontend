import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";


export default async function DashboardPage(){

  const supabase =
    await createServerSupabase();


  const {
    data:{
      user
    }
  } =
  await supabase.auth.getUser();



  if(!user){

    redirect("/auth/login");

  }



  return (
    <DashboardClient />
  );

}