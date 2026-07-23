"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

const CAPABILITIES = [
  {
    id: "creator",
    label: "Creator",
    description: "I create content and provide visibility",
  },
  {
    id: "brand",
    label: "Brand / Business",
    description: "I need visibility for my business",
  },
  {
    id: "advertiser",
    label: "Advertiser",
    description: "I run advertising campaigns",
  },
  {
    id: "billboard_owner",
    label: "Billboard Owner",
    description: "I provide advertising space",
  },
  {
    id: "agency",
    label: "Agency",
    description: "I manage campaigns for others",
  },
  {
    id: "ngo",
    label: "NGO",
    description: "I represent an organization",
  },
  {
    id: "government",
    label: "Government",
    description: "I represent a government entity",
  },
] as const;


export default function OnboardingForm() {

  const router = useRouter();

  const [fullName, setFullName] = useState("");

  const [username, setUsername] = useState("");

  const [capabilities, setCapabilities] = useState<string[]>([
    "creator",
  ]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);



  function toggleCapability(id: string) {

    setCapabilities((current) => {

      if (current.includes(id)) {

        return current.filter(
          item => item !== id
        );

      }

      return [
        ...current,
        id
      ];

    });

  }



  async function handleComplete() {

    setError(null);


    if (
      !fullName.trim() ||
      !username.trim()
    ) {

      setError(
        "Please fill all fields"
      );

      return;

    }


    if (capabilities.length === 0) {

      setError(
        "Select at least one capability"
      );

      return;

    }



    setLoading(true);



    try {

      const supabase =
        createBrowserSupabase();



      const {
        data:{
          user
        },
        error:userError

      } =
      await supabase.auth.getUser();



      if (
        userError ||
        !user
      ) {

        router.push(
          "/auth/login"
        );

        return;

      }



      const cleanUsername =
        username
        .trim()
        .toLowerCase();



      /*
        1. Update profile
      */

      const {
        error:profileError

      } =
      await supabase
      .from("profiles")
      .upsert(
        {

          id:user.id,

          full_name:
            fullName.trim(),

          username:
            cleanUsername,


          // compatibility field
          role:
            capabilities[0],


          kyc_status:
            "pending",

        },
        {
          onConflict:"id",
        }
      );



      if(profileError){

        console.error(
          profileError
        );

        setError(
          profileError.message
        );

        return;

      }



      /*
        2. Save capabilities
      */


      const capabilityRows =
        capabilities.map(
          capability => ({
            user_id:user.id,
            capability,
          })
        );



      const {
        error:capabilityError

      } =
      await supabase
      .from("user_capabilities")
      .upsert(
        capabilityRows,
        {
          onConflict:
            "user_id,capability",
        }
      );



      if(capabilityError){

        console.error(
          capabilityError
        );

        setError(
          capabilityError.message
        );

        return;

      }



      router.push(
        "/dashboard"
      );



    } catch(err){

      console.error(err);


      setError(
        "Something went wrong. Please try again."
      );


    } finally {

      setLoading(false);

    }

  }





  return (

    <main
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#050816]
      text-white
      px-6
      "
    >


      <div
        className="
        w-full
        max-w-md
        "
      >


        <h1
          className="
          text-3xl
          font-bold
          text-center
          mb-2
          "
        >
          Complete Your Profile
        </h1>


        <p
          className="
          text-center
          text-white/50
          mb-6
          "
        >
          Tell us how you participate in the visibility ecosystem
        </p>



        <div
          className="
          bg-white/5
          border
          border-white/10
          p-6
          rounded-2xl
          space-y-4
          "
        >



          <input

            placeholder="Full name"

            value={fullName}

            onChange={
              e =>
              setFullName(
                e.target.value
              )
            }

            className="
            w-full
            p-3
            rounded-lg
            bg-black/40
            border
            border-white/10
            outline-none
            "

          />



          <input

            placeholder="Username"

            value={username}

            onChange={
              e =>
              setUsername(
                e.target.value
              )
            }

            className="
            w-full
            p-3
            rounded-lg
            bg-black/40
            border
            border-white/10
            outline-none
            "

          />



          <div className="space-y-2">


            <p className="text-sm text-white/60">
              I am a:
            </p>



            {
              CAPABILITIES.map(item => (

                <label

                  key={item.id}

                  className="
                  flex
                  items-start
                  gap-3
                  p-3
                  rounded-lg
                  bg-black/30
                  border
                  border-white/10
                  cursor-pointer
                  "

                >

                  <input

                    type="checkbox"

                    checked={
                      capabilities.includes(
                        item.id
                      )
                    }

                    onChange={() =>
                      toggleCapability(
                        item.id
                      )
                    }

                  />


                  <div>

                    <p className="font-medium">
                      {item.label}
                    </p>

                    <p className="text-xs text-white/50">
                      {item.description}
                    </p>

                  </div>


                </label>

              ))
            }


          </div>




          {
            error && (

              <p
                className="
                text-red-400
                text-sm
                "
              >
                {error}
              </p>

            )
          }




          <button

            onClick={handleComplete}

            disabled={loading}

            className="
            w-full
            py-3
            rounded-lg
            bg-blue-600
            hover:bg-blue-500
            disabled:opacity-50
            "

          >

            {
              loading
              ? "Saving..."
              : "Continue"
            }


          </button>



        </div>


      </div>


    </main>

  );

}