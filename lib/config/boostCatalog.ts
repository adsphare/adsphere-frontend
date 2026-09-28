export const BOOST_CATALOG = {
  basic: {
    amount: 2000,
    currency: "ETB",
    boostScore: 100,
    durationDays: 7,
  },
  pro: {
    amount: 5000,
    currency: "ETB",
    boostScore: 250,
    durationDays: 14,
  },
  premium: {
    amount: 10000,
    currency: "ETB",
    boostScore: 600,
    durationDays: 30,
  },
} as const;

export type BoostPlan = keyof typeof BOOST_CATALOG;
