"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main
      className="
      relative
      min-h-screen
      overflow-hidden
      bg-[#050816]
      text-white
      px-6
      py-24
      "
    >

      {/* LIGHT FIELD */}

      <div
        className="
        absolute
        top-[-300px]
        left-1/2
        -translate-x-1/2
        w-[900px]
        h-[900px]
        rounded-full
        bg-blue-600/20
        blur-[200px]
        "
      />


      <div className="relative max-w-7xl mx-auto">



        {/* HERO */}

        <motion.section
          initial={{
            opacity: 0,
            y: 50
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 1
          }}
          className="text-center"
        >


          <div
            className="
            inline-flex
            px-5
            py-2
            rounded-full
            border
            border-blue-500/20
            bg-blue-500/10
            text-blue-300
            text-xs
            tracking-[0.25em]
            uppercase
            "
          >
            The Infrastructure Behind Attention
          </div>



          <h1
            className="
            mt-10
            text-5xl
            md:text-7xl
            font-semibold
            tracking-[-0.04em]
            leading-[1.05]
            "
          >

            One Ecosystem.

            <br />

            <span className="text-blue-400">
              Endless Connections.
            </span>

          </h1>




          <p
            className="
            mt-8
            max-w-3xl
            mx-auto
            text-xl
            leading-relaxed
            text-white/50
            "
          >

            Every opportunity starts with being seen.

            <br />

            Adspheria creates the infrastructure where
            brands, creators, advertisers, and spaces
            discover, connect, and grow together.

          </p>


        </motion.section>






        {/* SHOWCASE IMAGE */}


        <motion.div

          initial={{
            opacity:0,
            scale:.95
          }}

          whileInView={{
            opacity:1,
            scale:1
          }}

          transition={{
            duration:1
          }}

          viewport={{
            once:true
          }}

          className="
          relative
          mt-20
          h-[650px]
          rounded-[50px]
          overflow-hidden
          border
          border-white/10
          bg-white/5
          shadow-2xl
          "
        >


          <Image

            src="/showcase/about.jpg"

            alt="Adspheria ecosystem"

            fill

            className="
            object-cover
            "
          />


          <div
            className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#050816]
            via-transparent
            "
          />


        </motion.div>







        {/* SYSTEM PILLARS */}


        <section
          className="
          mt-28
          grid
          md:grid-cols-3
          gap-8
          "
        >


          {[
            {
              title:"A Connected Network",
              text:"A unified layer where brands, creators, advertisers, and physical spaces interact seamlessly."
            },

            {
              title:"Trusted Infrastructure",
              text:"Verified inventory, transparent transactions, and intelligent systems built for confidence."
            },

            {
              title:"Visibility Intelligence",
              text:"AI-powered ranking and analytics that transform attention into measurable outcomes."
            }

          ].map((item)=>(


            <motion.div

              key={item.title}

              whileHover={{
                y:-12,
                scale:1.02
              }}

              transition={{
                duration:.3
              }}

              className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              backdrop-blur-xl
              p-10
              "
            >


              <h3
                className="
                text-2xl
                font-semibold
                text-blue-400
                "
              >
                {item.title}
              </h3>



              <p
                className="
                mt-5
                text-white/50
                leading-relaxed
                "
              >
                {item.text}
              </p>


            </motion.div>


          ))}


        </section>








        {/* VISION */}


        <section
          className="
          mt-32
          text-center
          "
        >


          <h2
            className="
            text-5xl
            md:text-6xl
            font-semibold
            tracking-[-0.04em]
            leading-tight
            "
          >

            Beyond Advertising.

            <br />

            <span className="text-blue-400">
              The Visibility Economy.
            </span>


          </h2>




          <p
            className="
            mt-8
            max-w-3xl
            mx-auto
            text-xl
            text-white/50
            leading-relaxed
            "
          >

            Adspheria transforms fragmented advertising
            into a connected operating system where
            attention becomes measurable, valuable,
            and accessible.

          </p>


        </section>









        {/* NETWORK CORE */}


        <section
          className="
          mt-32
          flex
          justify-center
          "
        >


          <div
            className="
            relative
            w-[420px]
            h-[420px]
            rounded-full
            border
            border-blue-500/20
            flex
            items-center
            justify-center
            "
          >



            <motion.div

              animate={{
                rotate:360
              }}

              transition={{
                duration:30,
                repeat:Infinity,
                ease:"linear"
              }}

              className="
              absolute
              inset-0
              rounded-full
              border
              border-white/10
              "
            />



            <div className="text-center">


              <h3
                className="
                text-3xl
                font-semibold
                "
              >
                Adspheria
              </h3>


              <p
                className="
                mt-3
                text-white/40
                "
              >
                Powering the Visibility Economy
              </p>


            </div>


          </div>


        </section>



      </div>


    </main>
  );
}