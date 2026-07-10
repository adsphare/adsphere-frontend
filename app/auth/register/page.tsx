"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export default function RegisterPage() {

  const router = useRouter();

  const supabase = useMemo(
    () => createBrowserSupabase(),
    []
  );


  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  async function register() {

    if (!email.trim()) {

      setError("Please enter your email");

      return;
    }


    try {

      setLoading(true);

      setError("");
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

        setError(error.message);

        return;
      }


      setMessage(
        "Check your email. Your account setup link was sent."
      );


      router.push(
        "/auth/check-email"
      );


    } catch(err){

      setError(
        err instanceof Error
        ? err.message
        : "Something went wrong"
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


      <div className="
        w-full
        max-w-md
        p-8
        rounded-2xl
        bg-white/5
        border
        border-white/10
      ">


        <h1 className="
          text-3xl
          font-bold
          mb-2
        ">
          Create your Adspheria account
        </h1>


        <p className="
          text-white/50
          mb-6
        ">
          Enter your email to start your account.
        </p>


        <input

          type="email"

          placeholder="Email address"

          value={email}

          onChange={
            e => setEmail(e.target.value)
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


        {error && (

          <p className="
            mt-3
            text-red-400
            text-sm
          ">
            {error}
          </p>

        )}


        {message && (

          <p className="
            mt-3
            text-green-400
            text-sm
          ">
            {message}
          </p>

        )}



        <button

          onClick={register}

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
            : "Create Account"
          }

        </button>


      </div>


    </main>

  );

}
