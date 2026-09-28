import "server-only";

export type AgreementAction =
  | "CREATE"
  | "ACCEPT"
  | "REJECT"
  | "COMPLETE"
  | "CANCEL";

/**
 * Legacy agreement engine intentionally disabled.
 *
 * Agreements are retained as future canonical financial
 * infrastructure, but no production request may execute
 * this legacy implementation.
 */
export function agreementEngine(): never {
  throw new Error(
    "LEGACY_AGREEMENT_ENGINE_DISABLED: canonical agreement/escrow flow not yet enabled"
  );
}
