import { escrowEngine } from "./escrowEngine";

/* =========================
   SAFE ESCROW ACTION API
========================= */

export async function fundEscrow(escrowId: string) {
  return escrowEngine("FUND", escrowId);
}

export async function holdEscrow(escrowId: string) {
  return escrowEngine("HOLD", escrowId);
}

/* 🔥 ADD THESE (MISSING EXPORTS) */
export async function releaseEscrow(escrowId: string) {
  return escrowEngine("RELEASE", escrowId);
}

export async function refundEscrow(escrowId: string) {
  return escrowEngine("REFUND", escrowId);
}

export async function disputeEscrow(escrowId: string) {
  return escrowEngine("DISPUTE", escrowId);
}