"use client";

import { motion } from "framer-motion";


export default function FloatingNode({

  position,
  title,
  value,

}: {
  position: string;
  title: string;
  value: string;
}) {


  return (

    <motion.div

      animate={{
        y: [0, -12, 0],
      }}

      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}

      className={`
        absolute
        ${position}
        z-30
        rounded-2xl
        border
        border-white/10
        bg-white/[0.06]
        backdrop-blur-xl
        px-5
        py-4
        shadow-xl
        shadow-blue-500/10
        hover:bg-white/[0.1]
        transition
      `}

    >

      <p className="
        text-xs
        text-white/40
      ">
        {title}
      </p>


      <p className="
        text-blue-400
        font-semibold
      ">
        {value}
      </p>


    </motion.div>

  );

}