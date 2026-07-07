import { escrowEngine } from "@/lib/domain/escrow/escrowEngine";

export const intentEngine = {
  async handle({ action, payload }: any) {
    const map: Record<string, any> = {
      escrow_release_payment: ["RELEASE"],
      escrow_refund: ["REFUND"],
      escrow_dispute: ["DISPUTE"],
      escrow_fund: ["FUND"],
      escrow_hold: ["HOLD"],
    };

    const match = map[action];

    if (!match) throw new Error("Unknown action");

    return escrowEngine(match[0], payload.bookingId);
  },
};

