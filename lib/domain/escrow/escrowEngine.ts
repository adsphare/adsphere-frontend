export type EscrowAction =
  | "FUND"
  | "DELIVER"
  | "DISPUTE"
  | "RELEASE"
  | "REFUND";

export type EscrowState =
  | "pending"
  | "funded"
  | "delivered"
  | "disputed"
  | "release_pending"
  | "released"
  | "refund_pending"
  | "refunded";

export function escrowEngine(): never {
  throw new Error(
    "LEGACY_ESCROW_ENGINE_DISABLED: use the canonical escrow_orders settlement service",
  );
}