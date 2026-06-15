import { Variants } from "framer-motion";

/**
 * Fade up animation (base building block)
 */
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Fade in (no movement)
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

/**
 * Scale in (for cards / modals / popups)
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

/**
 * Stagger container (for lists like marketplace grid)
 */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/**
 * Card animation (perfect for marketplace listings)
 */
export const cardVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

/**
 * Slide in from left
 */
export const slideLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/**
 * Slide in from right
 */
export const slideRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};