import { MessageContext, EnforcementResult } from "@/lib/core/enforcement/types";
import { contactRule } from "@/lib/core/enforcement/rules/contactRule";
import { getTrust } from "@/lib/core/trust/store";

/**
 * MAIN POLICY ENGINE
 * Decides if a message is allowed inside Deal Room
 */
export async function evaluateMessage(
  ctx: MessageContext
): Promise<EnforcementResult> {

  // -------------------------
  // 1. CONTACT SHARING RULE
  // -------------------------
  if (contactRule(ctx.content)) {
    return "BLOCK";
  }

  // -------------------------
  // 2. ORDER VALIDATION RULE
  // -------------------------
  if (!ctx.orderId) {
    return "BLOCK";
  }

  // -------------------------
  // 3. TRUST SYSTEM RULE
  // -------------------------
  const trust = await getTrust(ctx.userId);

  const score = trust?.score ?? 0;

  // SECURITY FLOOR
  if (score <= 0) {
    return "BLOCK";
  }

  // LOW TRUST
  if (score < 15) {
    return "BLOCK";
  }

  // MEDIUM TRUST
  if (score < 30) {
    return "WARN";
  }

  // HIGH TRUST
  return "ALLOW";
}