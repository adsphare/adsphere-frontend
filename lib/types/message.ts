// /lib/types/message.ts

export type MessageStatusType =
  | "sent"
  | "delivered"
  | "seen"
  | "failed"
  | "pending";

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  status: MessageStatusType;
  created_at: string;
};




