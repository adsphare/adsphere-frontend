"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function AnimatedWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}





