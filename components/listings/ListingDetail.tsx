"use client";

import { useRouter } from "next/navigation";


type Listing = {
  id: string;
  title: string;
  description?: string;
  location: string;
  type?: string;
  price?: number;
  currency?: string;
  boost_score?: number;
  boosted?: boolean;
};


export default function ListingDetail({
  listing,
}:{
  listing: Listing;
}) {


  const router = useRouter();


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
          max-w-4xl
          mx-auto
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-10
          backdrop-blur-xl
        "
      >


        {/* TITLE */}

        <div className="flex justify-between">

          <h1
            className="
              text-4xl
              font-bold
            "
          >
            {listing.title}
          </h1>


          {listing.boosted && (

            <span
              className="
                px-3
                py-1
                rounded-full
                bg-blue-500/20
                text-blue-400
                text-sm
              "
            >
              Boosted
            </span>

          )}

        </div>




        {/* LOCATION */}

        <p
          className="
            mt-4
            text-white/60
          "
        >
          📍 {listing.location}
        </p>




        {/* TYPE */}

        {listing.type && (

          <p
            className="
              mt-2
              text-white/50
            "
          >

            Category:
            {" "}
            {listing.type}

          </p>

        )}






        {/* DESCRIPTION */}

        <div
          className="
            mt-8
            border-t
            border-white/10
            pt-6
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

            {listing.description ||
            "No description provided."}

          </p>


        </div>






        {/* PRICE */}

        {listing.price && (

          <div
            className="
              mt-8
              text-2xl
              font-bold
              text-green-400
            "
          >

            {listing.currency || "ETB"}
            {" "}
            {listing.price}

          </div>

        )}







        {/* ACTIONS */}

        <div
          className="
            mt-10
            flex
            gap-4
          "
        >

          <button

            onClick={()=>
              router.push(
                `/campaigns?listing=${listing.id}`
              )
            }

            className="
              flex-1
              bg-blue-600
              py-3
              rounded-xl
              font-semibold
              hover:bg-blue-500
            "

          >

            Create Campaign

          </button>





          <button

            className="
              flex-1
              border
              border-white/20
              py-3
              rounded-xl
              hover:bg-white/10
            "

          >

            Contact Owner

          </button>


        </div>



      </div>


    </section>

  );

}
