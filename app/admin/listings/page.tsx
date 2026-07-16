"use client";

import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import Link from "next/link";
import Image from "next/image";

import { createBrowserSupabase } from "@/lib/supabase/browser";


type Listing = {
  id: string;
  title: string;
  location: string;
  price: string;
  image?: string | null;
  created_at?: string;
};


export default function ListingsPage() {

  const supabase = useMemo(
    () => createBrowserSupabase(),
    []
  );


  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);



  const fetchListings = useCallback(
    async () => {

      setLoading(true);


      const {
        data,
        error,
      } = await supabase
        .from("listings")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );


      if (error) {

        console.error(
          "Listings error:",
          error.message
        );

        setListings([]);
        setLoading(false);

        return;
      }


      setListings(
        (data as Listing[]) || []
      );


      setLoading(false);

    },
    [supabase]
  );



  useEffect(() => {

    void fetchListings();

  }, [fetchListings]);




  if (loading) {

    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#050816]
        text-white
      ">
        Loading listings...
      </div>
    );

  }



  return (

    <div className="
      min-h-screen
      bg-[#050816]
      text-white
      p-6
    ">


      <div className="
        flex
        justify-between
        items-center
      ">

        <h1 className="
          text-2xl
          font-bold
        ">
          Marketplace Listings
        </h1>


        <Link
          href="/list-space"
          className="
            px-4
            py-2
            bg-blue-600
            rounded-lg
            hover:bg-blue-500
          "
        >
          Create Listing
        </Link>

      </div>



      <div className="
        mt-6
        grid
        md:grid-cols-3
        gap-4
      ">


        {listings.length === 0 ? (

          <div className="
            p-4
            bg-white/5
            rounded-xl
            text-white/50
          ">
            No listings found
          </div>


        ) : (


          listings.map(
            (item) => (

              <div
                key={item.id}
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-xl
                  overflow-hidden
                  hover:bg-white/10
                  transition
                "
              >


                <div className="
                  h-40
                  bg-black
                ">

                  {item.image ? (

                    <Image
                      src={item.image}
                      alt={item.title || "Listing image"}
                      width={400}
                      height={300}
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />


                  ) : (

                    <div className="
                      h-full
                      flex
                      items-center
                      justify-center
                      text-white/30
                    ">
                      No Image
                    </div>

                  )}

                </div>




                <div className="
                  p-4
                  space-y-2
                ">

                  <h2 className="font-semibold">
                    {item.title}
                  </h2>


                  <p className="
                    text-white/40
                    text-sm
                  ">
                    📍 {item.location}
                  </p>


                  <p className="
                    text-blue-400
                    font-bold
                  ">
                    {item.price}
                  </p>



                  <Link
                    href={`/listing/${item.id}`}
                    className="
                      inline-block
                      mt-2
                      text-xs
                      px-3
                      py-1
                      bg-blue-600
                      rounded
                    "
                  >
                    View
                  </Link>


                </div>


              </div>

            )

          )

        )}


      </div>


    </div>

  );

}