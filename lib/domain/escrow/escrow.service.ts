export function legacyEscrowServiceDisabled(): never {
  throw new Error(
    "Legacy escrow service is disabled. Use the canonical escrow settlement flow.",
  );
}
