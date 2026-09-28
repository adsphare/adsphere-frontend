import { MessageContext, EnforcementResult } from "@/lib/core/enforcement/types";
import { contactRule } from "@/lib/core/enforcement/rules/contactRule";

export type MessagePolicyContext = MessageContext & {
  trustScore: number;
};

export function evaluateMessage(
  ctx: MessagePolicyContext
): EnforcementResult {

  // -------------------------
  // 1. CONTACT SHARING RULE
  // -------------------------
  if (contactRule(ctx.content)) {
    return "BLOCK";
  }

  // -------------------------
  // 2. TRUST SYSTEM RULE
  // -------------------------
  const score = Math.max(0, Math.min(100, ctx.trustScore));

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
