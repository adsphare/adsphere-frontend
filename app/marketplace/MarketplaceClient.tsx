"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type {
  Listing,
} from "@/lib/core/ranking/listingRank";

import { trustScore } from "@/lib/core/trust/trustScore";


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



  useEffect(() => {


    async function loadTrust() {


      const scores =
        await Promise.all(

          initialListings.map(async (listing) => {


            const score =
              await trustScore.get(
                listing.user_id
              );


            return {
              id: listing.user_id,
              score,
            };


          })

        );



      const map: Record<string, number> = {};



      scores.forEach((item) => {

        map[item.id] =
          item.score;

      });



      setTrustMap(map);


    }



    if (initialListings.length > 0) {

      loadTrust();

    }


  }, [initialListings]);





  function trustLabel(score: number) {


    if (score >= 80)
      return "🟢 Verified";


    if (score >= 60)
      return "🔵 Trusted";


    if (score >= 40)
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
        py-10
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
            mb-10
          "
        >

          <h1
            className="
              text-4xl
              font-bold
            "
          >
            Marketplace
          </h1>


          <p
            className="
              text-white/50
              mt-2
            "
          >
            Discover verified visibility spaces.
          </p>


        </div>





        {/* EMPTY STATE */}

        {initialListings.length === 0 && (

          <div
            className="
              border
              border-white/10
              rounded-2xl
              p-10
              text-center
              text-white/50
            "
          >
            No listings available.
          </div>

        )}






        {/* LISTINGS GRID */}

        <div
          className="
            grid
            md:grid-cols-3
            gap-6
          "
        >



          {initialListings.map((item) => {



            const trust =
              trustMap[item.user_id] ?? 50;




            return (


              <article

                key={item.id}

                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  backdrop-blur-xl
                  p-6
                  hover:border-blue-500/40
                  transition
                "

              >



                <div
                  className="
                    flex
                    justify-between
                    items-start
                    gap-3
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
                    text-white/60
                    mt-3
                  "
                >
                  {item.location}
                </p>





                <div
                  className="
                    mt-5
                    space-y-2
                    text-sm
                  "
                >


                  <p
                    className="
                      text-white/50
                    "
                  >

                    Trust:

                    <span
                      className="
                        text-white
                        ml-2
                      "
                    >
                      {trust}/100
                    </span>

                  </p>





                  <p
                    className="
                      text-blue-400
                    "
                  >

                    Visibility Rank:

                    {" "}

                    {item.rank.toFixed(1)}

                  </p>



                </div>





                <button

                  onClick={() => {

                    router.push(
                      `/marketplace/${item.id}`
                    );

                  }}

                  className="
                    mt-6
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


          })}



        </div>


      </div>


    </section>

  );

}
