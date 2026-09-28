/**
 * Legacy Boost service.
 *
 * Financial Boost activation is intentionally disabled.
 * Boosts may only become active through the canonical
 * payment-authority settlement flow.
 */

export const boostService = {
  async activate(): Promise<never> {
    throw new Error(
      "Legacy Boost activation is disabled. Use the canonical payment settlement flow.",
    );
  },
};
