"use client";

import { useEffect, useState } from "react";

type Plan = "basic" | "pro" | "premium";

type Props = {
  open: boolean;
  onClose: () => void;
  listingId: string;
};

export default function BoostModal({
  open,
  onClose,
  listingId,
}: Props) {

  const [loadingPlan, setLoadingPlan] =
    useState<Plan | null>(null);


  useEffect(() => {

    if (!open) {
      setLoadingPlan(null);
    }

  }, [open]);



  if (!open) return null;



  async function pay(plan: Plan) {

    if (loadingPlan) return;


    setLoadingPlan(plan);


    try {

      const res = await fetch(
        "/api/chapa/initialize",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            listingId,
            plan,
          }),
        }
      );


      const data = await res.json();



      if (!res.ok || !data.checkout_url) {

        throw new Error(
          data.message ||
          "Payment initialization failed"
        );

      }



      window.location.href =
        data.checkout_url;



    } catch (error) {

      console.error(
        "CHAPA ERROR:",
        error
      );


      alert(
        error instanceof Error
          ? error.message
          : "Payment failed"
      );


      setLoadingPlan(null);

    }

  }




  const plans = [

    {
      id:"basic" as Plan,

      title:"Basic Boost",

      price:"ETB 2,000",

      desc:"Increase visibility for 7 days",

      features:[
        "Standard ranking boost",
        "Homepage exposure",
      ],

      color:
        "from-blue-500 to-blue-700",

    },


    {
      id:"pro" as Plan,

      title:"Pro Boost",

      price:"ETB 5,000",

      desc:"Higher ranking for growing businesses",

      features:[
        "2× visibility",
        "Priority ranking",
      ],

      color:
        "from-purple-500 to-purple-700",

      highlight:true,

    },


    {
      id:"premium" as Plan,

      title:"Premium Boost",

      price:"ETB 10,000",

      desc:"Maximum exposure across Adspheria",

      features:[
        "Top placement",
        "Featured listing",
        "Highest visibility",
      ],

      color:
        "from-orange-500 to-red-500",

    },

  ];





  return (

    <div
      className="
      fixed
      inset-0
      bg-black/70
      flex
      items-center
      justify-center
      z-50
      p-4
      "
    >


      <div
        className="
        bg-[#0b1020]
        border
        border-white/10
        rounded-2xl
        w-full
        max-w-4xl
        p-6
        "
      >


        <div
          className="
          flex
          justify-between
          items-center
          mb-6
          "
        >

          <div>

            <h2
              className="
              text-xl
              font-bold
              text-white
              "
            >
              Boost Listing 🚀
            </h2>


            <p
              className="
              text-white/40
              text-sm
              "
            >
              Choose a visibility package
            </p>

          </div>



          <button
            onClick={onClose}
            className="
            text-white/40
            hover:text-white
            "
          >
            ✕
          </button>


        </div>





        <div
          className="
          grid
          md:grid-cols-3
          gap-5
          "
        >


          {plans.map((plan)=>{


            const loading =
              loadingPlan === plan.id;


            const disabled =
              loadingPlan !== null;



            return (

              <div
                key={plan.id}

                className={`
                relative
                rounded-xl
                border
                border-white/10
                bg-white/5
                p-5

                ${
                  plan.highlight
                  ? "ring-2 ring-purple-500"
                  : ""
                }

                ${
                  disabled && !loading
                  ? "opacity-40"
                  : ""
                }

                `}
              >



                {plan.highlight && (

                  <div
                    className="
                    absolute
                    -top-3
                    right-4
                    bg-purple-500
                    text-xs
                    px-3
                    py-1
                    rounded-full
                    text-white
                    "
                  >
                    Popular
                  </div>

                )}





                <h3
                  className="
                  text-lg
                  font-semibold
                  text-white
                  "
                >
                  {plan.title}
                </h3>



                <p
                  className="
                  text-3xl
                  font-bold
                  text-white
                  mt-3
                  "
                >
                  {plan.price}
                </p>



                <p
                  className="
                  text-white/40
                  text-sm
                  mt-2
                  "
                >
                  {plan.desc}
                </p>




                <ul
                  className="
                  mt-4
                  space-y-2
                  text-sm
                  text-white/60
                  "
                >

                  {plan.features.map(
                    (feature,index)=>(

                      <li key={index}>
                        • {feature}
                      </li>

                    )
                  )}

                </ul>




                <button

                  disabled={disabled}

                  onClick={() =>
                    pay(plan.id)
                  }


                  className={`
                  mt-6
                  w-full
                  py-3
                  rounded-xl
                  font-semibold
                  text-black
                  bg-gradient-to-r
                  ${plan.color}
                  hover:opacity-90
                  transition
                  `}
                >

                  {
                    loading
                    ? "Processing..."
                    : "Pay with Chapa"
                  }

                </button>



              </div>

            );

          })}


        </div>




        <p
          className="
          text-center
          text-xs
          text-white/30
          mt-6
          "
        >
          Secure payment via Chapa • Boost activates after confirmation
        </p>



      </div>


    </div>

  );

}