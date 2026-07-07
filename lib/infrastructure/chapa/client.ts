export const chapaConfig = {
  baseUrl: "https://api.chapa.co/v1",
  secretKey: process.env.CHAPA_SECRET_KEY,
} as const;

/* =========================
   SAFETY CHECK (IMPORTANT)
========================= */
if (!chapaConfig.secretKey) {
  throw new Error("Missing CHAPA_SECRET_KEY in environment variables");
}





