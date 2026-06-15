"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export default function AnimatedWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}