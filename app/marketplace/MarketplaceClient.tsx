"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type {
  Listing,
} from "@/lib/listings/types";
type RankedListing = Listing & {
  rank: number;
};



export default function MarketplaceClient({
  initialListings,
}: {
  initialListings: RankedListing[];
}) {


  const router = useRouter();


  const [trustMap, setTrustMap] =
    useState<Record<string, number>>({});



  /*
  =====================================
  LOAD TRUST SCORES FROM API
  =====================================
  */

  useEffect(() => {


    async function loadTrust() {


      const userIds =
        initialListings.map(
          (item) => item.user_id
        );



      if (!userIds.length) return;



      try {


        const response =
          await fetch("/api/trust", {

            method:"POST",

            headers:{
              "Content-Type":"application/json",
            },

            body:JSON.stringify({
              userIds,
            }),

          });



        const data =
          await response.json();



        setTrustMap(data);



      } catch(error){

        console.error(
          "TRUST LOAD ERROR",
          error
        );

      }


    }



    loadTrust();


  },[initialListings]);







  function trustLabel(score:number){


    if(score >= 80)
      return "🟢 Verified";


    if(score >= 60)
      return "🔵 Trusted";


    if(score >= 40)
      return "🟡 New";


    return "🔴 Low Trust";


  }







  return (


    <section
      className="
      min-h-screen
      bg-[#050816]
      text-white
      px-6
      py-16
      "
    >


      <div
        className="
        max-w-7xl
        mx-auto
        "
      >



        {/* HEADER */}


        <div
          className="
          mb-12
          "
        >


          <h1
            className="
            text-5xl
            font-semibold
            tracking-tight
            "
          >
            Visibility Marketplace
          </h1>



          <p
            className="
            mt-4
            text-white/50
            text-lg
            "
          >
            Discover verified advertising spaces,
            creators, and visibility opportunities.
          </p>


        </div>








        {/* EMPTY */}


        {
          initialListings.length === 0 && (


            <div
              className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-10
              text-center
              text-white/50
              "
            >

              No visibility spaces available yet.

            </div>


          )
        }








        {/* GRID */}


        <div
          className="
          grid
          md:grid-cols-3
          gap-8
          "
        >



          {
            initialListings.map((item)=>{


              const trust =
                trustMap[item.user_id] ?? 50;



              return (


                <article

                  key={item.id}

                  className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.05]
                  backdrop-blur-xl
                  p-7
                  hover:border-blue-500/40
                  hover:-translate-y-2
                  transition
                  "

                >





                  <div
                    className="
                    flex
                    justify-between
                    gap-4
                    "
                  >



                    <h2
                      className="
                      text-xl
                      font-semibold
                      "
                    >

                      {item.title}

                    </h2>



                    <span
                      className="
                      text-xs
                      whitespace-nowrap
                      px-3
                      py-1
                      rounded-full
                      bg-white/10
                      "
                    >

                      {trustLabel(trust)}

                    </span>



                  </div>








                  <p
                    className="
                    mt-4
                    text-white/50
                    "
                  >

                    {item.location}

                  </p>








                  <div
                    className="
                    mt-6
                    space-y-3
                    text-sm
                    "
                  >



                    <div
                      className="
                      flex
                      justify-between
                      "
                    >

                      <span className="text-white/40">
                        Trust Score
                      </span>


                      <span>
                        {trust}/100
                      </span>


                    </div>





                    <div
                      className="
                      flex
                      justify-between
                      "
                    >

                      <span className="text-white/40">
                        Visibility Rank
                      </span>


                      <span
                        className="
                        text-blue-400
                        "
                      >
                        {item.rank.toFixed(1)}
                      </span>


                    </div>



                  </div>









                  <button

                    onClick={()=>{

                      router.push(
                        `/marketplace/${item.id}`
                      );

                    }}

                    className="
                    mt-8
                    w-full
                    rounded-xl
                    bg-blue-600
                    py-3
                    font-semibold
                    hover:bg-blue-500
                    transition
                    "

                  >

                    View Space

                  </button>





                </article>


              );


            })
          }




        </div>





      </div>



    </section>


  );


}