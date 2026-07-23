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


      {/* BACKGROUND LIGHT */}

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
        blur-[220px]
        "
      />


      <div className="relative max-w-7xl mx-auto">



        {/* HERO */}


        <motion.section

          initial={{
            opacity:0,
            y:40
          }}

          animate={{
            opacity:1,
            y:0
          }}

          transition={{
            duration:1
          }}

          className="
          text-center
          "

        >


          <div

            className="
            inline-flex
            px-5
            py-2
            rounded-full
            border
            border-blue-500/30
            bg-blue-500/10
            text-blue-300
            text-xs
            uppercase
            tracking-[0.35em]
            "

          >

            The Infrastructure Behind Attention

          </div>





          <h1

            className="
            mt-10
            text-5xl
            sm:text-6xl
            md:text-7xl
            font-semibold
            tracking-[-0.05em]
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
            text-lg
            md:text-xl
            leading-relaxed
            text-white/50
            "

          >

            Every opportunity starts with being seen.

            <br />

            Adspheria creates the infrastructure where
            brands, creators, advertisers, and visibility
            spaces connect, collaborate, and grow.

          </p>



        </motion.section>







        {/* ABOUT SHOWCASE */}


        <motion.div


          initial={{
            opacity:0,
            y:50,
            scale:.96
          }}


          whileInView={{
            opacity:1,
            y:0,
            scale:1
          }}


          viewport={{
            once:true,
            amount:.2
          }}


          transition={{
            duration:1
          }}


          className="
          relative
          mt-20
          h-[420px]
          md:h-[650px]
          rounded-[45px]
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
              title:"Connected Network",
              text:"A unified ecosystem connecting brands, creators, advertisers, and physical visibility spaces."
            },

            {
              title:"Trusted Infrastructure",
              text:"Verified participants, transparent transactions, and systems designed for confidence."
            },

            {
              title:"Visibility Intelligence",
              text:"AI-powered ranking and analytics transforming attention into measurable impact."
            }

          ].map((item)=>(


            <motion.div

              key={item.title}


              whileHover={{
                y:-12,
                scale:1.03
              }}


              className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.05]
              backdrop-blur-xl
              p-8
              md:p-10
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
                {/* VISION SECTION */}


        <section

          className="
          mt-36
          text-center
          "

        >


          <h2

            className="
            text-5xl
            md:text-7xl
            font-semibold
            tracking-[-0.05em]
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
            text-lg
            md:text-xl
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
          mt-36
          flex
          justify-center
          "

        >


          <div

            className="
            relative
            w-[320px]
            h-[320px]
            md:w-[460px]
            md:h-[460px]
            rounded-full
            border
            border-blue-500/20
            flex
            items-center
            justify-center
            "

          >




            {/* ROTATING RING */}


            <motion.div

              animate={{
                rotate:360
              }}

              transition={{
                duration:35,
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






            {/* CENTER LOGO */}



            <div

              className="
              relative
              z-20
              text-center
              "

            >



              <div

                className="
                relative
                w-[140px]
                h-[140px]
                md:w-[180px]
                md:h-[180px]
                mx-auto
                "

              >



                <motion.div

                  animate={{

                    scale:[
                      1,
                      1.08,
                      1
                    ],

                    opacity:[
                      .25,
                      .55,
                      .25
                    ]

                  }}

                  transition={{

                    duration:5,
                    repeat:Infinity,
                    ease:"easeInOut"

                  }}

                  className="
                  absolute
                  inset-0
                  rounded-full
                  bg-blue-500/20
                  blur-3xl
                  "

                />





                <Image

                  src="/logo.png"

                  alt="Adspheria"

                  fill

                  className="
                  object-contain
                  drop-shadow-[0_0_70px_rgba(59,130,246,.9)]
                  "

                />


              </div>






              <h3

                className="
                mt-6
                text-3xl
                font-semibold
                "

              >

                Adspheria

              </h3>





              <p

                className="
                mt-2
                text-xs
                md:text-sm
                text-white/40
                uppercase
                tracking-[0.25em]
                "

              >

                Visibility Infrastructure

              </p>



            </div>








            {/* NETWORK NODES */}



            <NetworkNode

              title="Brands"

              position="
              -top-5
              left-1/2
              -translate-x-1/2
              "

            />



            <NetworkNode

              title="Creators"

              position="
              left-0
              top-1/2
              -translate-y-1/2
              "

            />



            <NetworkNode

              title="Advertisers"

              position="
              right-0
              top-1/2
              -translate-y-1/2
              "

            />



            <NetworkNode

              title="Analytics"

              position="
              -bottom-5
              left-1/2
              -translate-x-1/2
              "

            />




          </div>


        </section>





      </div>


    </main>

  );

}








function NetworkNode({

  title,

  position,

}:{

  title:string;

  position:string;

}){


  return (

    <motion.div


      animate={{

        y:[
          0,
          -10,
          0
        ]

      }}


      transition={{

        duration:4,
        repeat:Infinity,
        ease:"easeInOut"

      }}


      className={`
      absolute
      ${position}
      z-30
      `}


    >



      <div

        className="
        px-4
        md:px-6
        py-3
        rounded-2xl
        border
        border-white/10
        bg-white/[0.06]
        backdrop-blur-xl
        shadow-xl
        "

      >



        <p

          className="
          text-[10px]
          md:text-xs
          uppercase
          tracking-[0.25em]
          text-blue-300
          "

        >

          {title}

        </p>


      </div>


    </motion.div>


  );

}