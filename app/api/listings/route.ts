import { NextResponse } from "next/server";

import { createNewListing } from "@/lib/listings/service";

import { createServerSupabase } from "@/lib/supabase/server";


export async function POST(
  request: Request
) {

  try {

    const supabase =
      await createServerSupabase();



    const {
      data:{
        user
      },
      error
    } =
      await supabase.auth.getUser();



    console.log(
      "AUTH USER:",
      user?.id
    );


    if(error || !user){

      return NextResponse.json(
        {
          error:"Unauthorized"
        },
        {
          status:401
        }
      );

    }



    const body =
      await request.json();



    const listing =
      await createNewListing({

        user_id:user.id,

        title:body.title,

        description:
          body.description ?? "",

        location:
          body.location,

        type:
          body.type,

        price:
          Number(body.price),

      });



    return NextResponse.json(
      listing,
      {
        status:201
      }
    );


  } catch(error:any){

    console.error(
      "CREATE LISTING ERROR:",
      error.message
    );


    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    );

  }

}
