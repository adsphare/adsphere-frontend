import { Variants, Transition } from "framer-motion";

const baseTransition: Transition = {
  duration: 0.6,
  ease: "easeOut",
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: baseTransition,
  },
};