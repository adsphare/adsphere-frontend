"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FloatingNode from "./FloatingNode";
import OrbitDot from "./OrbitDot";

export default function HeroCore() {

  return (
    <motion.div

      initial={{
        opacity:0,
        scale:0.85,
        y:30
      }}

      animate={{
        opacity:1,
        scale:1,
        y:0
      }}

      transition={{
        duration:1.3,
        ease:"easeOut"
      }}

      className="
      relative
      h-[620px]
      md:h-[680px]
      flex
      items-center
      justify-center
      "

    >

      {/* WE WILL PUT ORBIT SYSTEM HERE */}

    </motion.div>
  );
}