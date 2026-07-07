export type EnforcementResult =
  | "ALLOW"
  | "BLOCK"
  | "WARN"
  | "ESCALATE";

export type MessageContext = {
  userId: string;
  conversationId: string;
  orderId?: string;
  content: string;
};

