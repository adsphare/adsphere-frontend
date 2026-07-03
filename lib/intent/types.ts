export type IntentAction =
  | "CREATE_CAMPAIGN"
  | "ACCEPT_OFFER"
  | "SUBMIT_WORK"
  | "APPROVE_WORK"
  | "REJECT_WORK"
  | "START_CHAT"
  | "REQUEST_PAYMENT";

export type IntentMessage = {
  type: "intent";
  action: IntentAction;
  payload?: any;
  userId: string;
  conversationId?: string;
};





