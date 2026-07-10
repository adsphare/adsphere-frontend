"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export default function OnboardingForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  const [role, setRole] = useState<
    "creator" | "brand" | "advertiser"
  >("creator");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  async function handleComplete() {

    setError(null);


    if (!fullName.trim() || !username.trim()) {
      setError("Please fill all fields");
      return;
    }


    setLoading(true);


    try {

      const supabase = createBrowserSupabase();


      const {
        data: {
          user
        },
        error: userError
      } = await supabase.auth.getUser();


      if (userError || !user) {

        router.push("/auth/login");
        return;

      }


      const cleanUsername =
        username.trim().toLowerCase();



      const {
        error
      } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,

            email: user.email,

            full_name:
              fullName.trim(),

            username:
              cleanUsername,

            role,

            verification_status:
              "pending",

            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict: "id",
          }
        );



      if (error) {

        console.error(
          "PROFILE ERROR:",
          error
        );

        setError(error.message);
        return;

      }



      router.push("/dashboard");


    } catch (err) {

      console.error(err);

      setError(
        "Something went wrong. Please try again."
      );


    } finally {

      setLoading(false);

    }

  }



  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#050816]
      text-white
      px-6
    ">

      <div className="w-full max-w-md">


        <h1 className="
          text-3xl
          font-bold
          text-center
          mb-2
        ">
          Complete Your Profile
        </h1>


        <p className="
          text-center
          text-white/50
          mb-6
        ">
          Tell us about yourself
        </p>



        <div className="
          bg-white/5
          border
          border-white/10
          p-6
          rounded-2xl
          space-y-4
        ">


          <input
            placeholder="Full name"
            value={fullName}
            onChange={(e)=>
              setFullName(e.target.value)
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
            onChange={(e)=>
              setUsername(e.target.value)
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



          <select
            value={role}
            onChange={(e)=>
              setRole(
                e.target.value as
                "creator" |
                "brand" |
                "advertiser"
              )
            }
            className="
              w-full
              p-3
              rounded-lg
              bg-black/40
              border
              border-white/10
            "
          >

            <option value="creator">
              Creator
            </option>

            <option value="brand">
              Brand
            </option>

            <option value="advertiser">
              Advertiser
            </option>

          </select>



          {error && (

            <p className="
              text-red-400
              text-sm
            ">
              {error}
            </p>

          )}



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
