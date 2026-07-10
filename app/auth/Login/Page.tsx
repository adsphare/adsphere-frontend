"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = useMemo(
    () => createBrowserSupabase(),
    []
  );


  async function login() {

    if (!email.trim()) {
      setMessage("Enter your email");
      return;
    }


    try {

      setLoading(true);
      setMessage("");


      const { error } =
        await supabase.auth.signInWithOtp({

          email: email.trim(),

          options: {

            emailRedirectTo:
              `${window.location.origin}/auth/callback`,

          },

        });


      if(error){

        console.error(
          "MAGIC LINK ERROR:",
          error.message
        );

        setMessage(error.message);

        return;
      }


      setMessage(
        "Check your email for the login link"
      );


      router.push(
        "/auth/check-email"
      );


    } catch(err){

      console.error(
        "LOGIN CRASH:",
        err
      );

      setMessage(
        "Something went wrong"
      );


    } finally {

      setLoading(false);

    }

  }


  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#050816]
      text-white
      px-6
    ">


      <div className="
        w-full
        max-w-md
        p-8
        bg-white/5
        border
        border-white/10
        rounded-2xl
      ">


        <h1 className="
          text-2xl
          font-bold
          mb-6
        ">
          Welcome back to Adspheria
        </h1>


        <input

          type="email"

          className="
            w-full
            p-3
            rounded-lg
            text-black
          "

          placeholder="Enter your email"

          value={email}

          onChange={
            e => setEmail(e.target.value)
          }

        />


        {message && (

          <p className="
            mt-3
            text-sm
            text-blue-300
          ">

            {message}

          </p>

        )}


        <button

          onClick={login}

          disabled={loading}

          className="
            mt-5
            w-full
            p-3
            rounded-lg
            bg-blue-600
            hover:bg-blue-500
          "

        >

          {
            loading
            ? "Sending..."
            : "Send Magic Link"
          }

        </button>


      </div>


    </div>

  );

}
