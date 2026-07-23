import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";


export async function POST(req: Request) {

  try {

    const supabase =
      await createServerSupabase();


    const CHAPA_SECRET_KEY =
      process.env.CHAPA_SECRET_KEY;


    const SITE_URL =
      process.env.NEXT_PUBLIC_APP_URL;



    if (!CHAPA_SECRET_KEY || !SITE_URL) {

      return NextResponse.json(
        {
          success:false,
          message:"Missing Chapa environment variables",
        },
        {
          status:500,
        }
      );

    }



    const {
      listingId,
      plan,
      email,
    } = await req.json();




    if (!listingId || !plan) {

      return NextResponse.json(
        {
          success:false,
          message:"Missing listingId or plan",
        },
        {
          status:400,
        }
      );

    }




    // AUTH USER

    const {
      data:{
        user
      }

    } =
      await supabase.auth.getUser();




    if (!user) {

      return NextResponse.json(
        {
          success:false,
          message:"Unauthorized",
        },
        {
          status:401,
        }
      );

    }




    // ENSURE PUBLIC USER EXISTS

    const {
      data: existingUser
    } =
      await supabase
      .from("users")
      .select("id")
      .eq(
        "id",
        user.id
      )
      .maybeSingle();




    if (!existingUser) {


      const {
        error:userCreateError
      } =
        await supabase
        .from("users")
        .insert({

          id:user.id,

          email:user.email,

          role:"user",

          trust_level:"new",

          is_verified:false,

        });



      if(userCreateError){

        console.error(
          "USER CREATE ERROR:",
          userCreateError
        );


        return NextResponse.json(
          {
            success:false,
            message:userCreateError.message,
          },
          {
            status:500,
          }
        );

      }

    }





    // CHECK LISTING

    const {
      data:listing,
      error:listingError

    } =
      await supabase
      .from("listings")
      .select(
        "id,user_id,title"
      )
      .eq(
        "id",
        listingId
      )
      .single();




    if(listingError || !listing){

      return NextResponse.json(
        {
          success:false,
          message:"Listing not found",
        },
        {
          status:404,
        }
      );

    }




    if(listing.user_id !== user.id){

      return NextResponse.json(
        {
          success:false,
          message:"You don't own this listing",
        },
        {
          status:403,
        }
      );

    }





    // BOOST PLANS

    const prices:Record<string,number> = {

      basic:2000,

      pro:5000,

      premium:10000,

    };




    const amount =
      prices[plan];




    if(!amount){

      return NextResponse.json(
        {
          success:false,
          message:"Invalid boost plan",
        },
        {
          status:400,
        }
      );

    }





    const tx_ref =
      `boost_${listingId}_${Date.now()}`;






    // PAYMENT RECORD

    const {
      error:paymentError

    } =
      await supabase
      .from("payments")
      .insert({

        user_id:user.id,

        amount,

        currency:"ETB",

        provider:"chapa",

        status:"pending",

        legacy_transaction_ref:
          tx_ref,

        provider_reference:
          tx_ref,

      });





    if(paymentError){

      console.error(
        "PAYMENT INSERT ERROR:",
        paymentError
      );


      return NextResponse.json(
        {
          success:false,
          message:paymentError.message,
        },
        {
          status:500,
        }
      );

    }







    // CHAPA INITIALIZE

    const chapaResponse =
      await fetch(
        "https://api.chapa.co/v1/transaction/initialize",
        {

          method:"POST",

          headers:{

            Authorization:
              `Bearer ${CHAPA_SECRET_KEY}`,

            "Content-Type":
              "application/json",

          },


          body:JSON.stringify({

            amount,

            currency:"ETB",

            email:
              email ||
              user.email ||
              "customer@adspheria.com",


            first_name:
              "Adspheria",


            last_name:
              "Customer",


            tx_ref,


            callback_url:
              `${SITE_URL}/api/chapa/verify`,


            return_url:
              `${SITE_URL}/boost/success`,



            customization:{

              title:
                "Adspheria Boost",


              description:
                `${plan} visibility boost for ${listing.title}`,

            },

          }),

        }
      );






    const chapaData =
      await chapaResponse.json();






    if(
      !chapaResponse.ok ||
      !chapaData?.data?.checkout_url
    ){

      console.error(
        "CHAPA ERROR:",
        chapaData
      );


      return NextResponse.json(
        {
          success:false,

          message:
            "Chapa initialization failed",

          raw:
            chapaData,

        },
        {
          status:500,
        }
      );

    }






    return NextResponse.json({

      success:true,

      checkout_url:
        chapaData.data.checkout_url,

      tx_ref,

    });




  } catch(error:any){


    console.error(
      "CHAPA INITIALIZE ERROR:",
      error
    );


    return NextResponse.json(
      {
        success:false,

        message:
          error.message ||
          "Server error",
      },
      {
        status:500,
      }
    );

  }

}