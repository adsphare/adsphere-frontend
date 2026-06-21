"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import type { ReactNode } from "react";

export default function AnimatedWrapper({
  children,
}: {
  children: ReactNode;
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