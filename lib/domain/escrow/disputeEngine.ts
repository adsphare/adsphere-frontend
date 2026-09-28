export type DisputeAction = "OPEN";

/**
 * Legacy dispute engine intentionally disabled.
 *
 * Dispute creation must use the canonical `open_dispute` RPC,
 * which derives buyer/seller identity from escrow_orders and
 * atomically creates the dispute + locks the escrow.
 */
export function disputeEngine(): never {
  throw new Error(
    "LEGACY_DISPUTE_ENGINE_DISABLED: use the canonical open_dispute RPC",
  );
}