import ChatButton from "@/components/ChatButton";
import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";


type Props = {
  params: Promise<{
    id: string;
  }>;
};


type Listing = {

  id:string;

  user_id:string;

  title:string;

  description:string | null;

  location:string;

  type:string | null;

  price:number | null;

  currency:string | null;

  media:any;

  dimensions:string | null;

  boost_score:number | null;

  boosted:boolean | null;

};




export default async function MarketplaceDetailPage({
  params,
}:Props){


  const {id} = await params;



  const supabase =
    await createServerSupabase();




  const {
    data:listing,
    error
  } = await supabase

    .from("listings")

    .select(
      `
      id,
      user_id,
      title,
      description,
      location,
      type,
      price,
      currency,
      media,
      dimensions,
      boost_score,
      boosted
      `
    )

    .eq(
      "id",
      id
    )

    .single();




  if(error || !listing){

    notFound();

  }




  const typedListing =
    listing as Listing;





  /*
     MEDIA HANDLING

     Supports:
     [
       "image1.jpg",
       "image2.jpg"
     ]

     and future:
     {
       url:"..."
     }
  */

  let image:string|null=null;



  if(Array.isArray(typedListing.media)){

    image =
      typedListing.media[0] ?? null;

  }


  if(
    typeof typedListing.media === "string"
  ){

    image =
      typedListing.media;

  }






  return (

    <main
      className="
      min-h-screen
      bg-[#050816]
      text-white
      "
    >



      {/* HERO IMAGE */}

      <section
        className="
        h-[420px]
        w-full
        bg-black
        overflow-hidden
        "
      >


        {image ? (

          <img

            src={image}

            alt={typedListing.title}

            className="
            w-full
            h-full
            object-cover
            "
          />

        ):(


          <div
            className="
            h-full
            flex
            items-center
            justify-center
            text-white/30
            "
          >

            Visibility Space


          </div>


        )}



      </section>






      {/* CONTENT */}


      <section
        className="
        max-w-5xl
        mx-auto
        px-6
        py-10
        space-y-8
        "
      >




        {/* HEADER */}


        <div
          className="
          flex
          justify-between
          gap-6
          "
        >



          <div>


            <div
              className="
              flex
              items-center
              gap-3
              "
            >


              <h1
                className="
                text-4xl
                font-bold
                "
              >

                {typedListing.title}

              </h1>



              {
                typedListing.boosted && (

                  <span
                    className="
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    bg-blue-500/20
                    text-blue-400
                    "
                  >

                    Boosted

                  </span>

                )
              }


            </div>





            <p
              className="
              mt-3
              text-white/50
              "
            >

              📍 {typedListing.location}

            </p>




            {
              typedListing.type && (

                <p
                  className="
                  mt-2
                  text-sm
                  text-white/40
                  "
                >

                  Category:
                  {" "}
                  {typedListing.type}

                </p>

              )
            }



          </div>





          <div
            className="
            text-right
            "
          >


            <p
              className="
              text-3xl
              font-bold
              text-green-400
              "
            >

              {typedListing.currency ?? "ETB"}

              {" "}

              {typedListing.price ?? 0}


            </p>




            {
              typedListing.boost_score &&
              (

                <p
                  className="
                  text-xs
                  text-blue-400
                  mt-2
                  "
                >

                  Visibility Score:
                  {" "}
                  {typedListing.boost_score}

                </p>

              )
            }



          </div>




        </div>








        {/* DESCRIPTION */}


        <div
          className="
          rounded-2xl
          border
          border-white/10
          bg-white/5
          p-6
          "
        >

          <h2
            className="
            text-xl
            font-semibold
            "
          >

            About this visibility space

          </h2>


          <p
            className="
            mt-3
            text-white/70
            leading-relaxed
            "
          >

            {
              typedListing.description ??
              "No description provided."
            }

          </p>


        </div>







        {/* SPACE DETAILS */}


        {
          typedListing.dimensions && (

            <div
              className="
              border
              border-white/10
              rounded-xl
              p-5
              bg-white/5
              "
            >

              <h3
                className="font-semibold"
              >

                Dimensions

              </h3>


              <p
                className="text-white/60 mt-2"
              >

                {typedListing.dimensions}

              </p>


            </div>

          )
        }







        {/* ACTIONS */}


        <div
          className="
          border-t
          border-white/10
          pt-6
          "
        >


          <ChatButton

            listing={{
              id:typedListing.id,
              user_id:typedListing.user_id
            }}

          />


        </div>





      </section>



    </main>

  );

}