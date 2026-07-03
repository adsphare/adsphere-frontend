export type EventType =
  /* =========================
     CAMPAIGNS
  ========================= */
  | "campaign.created"
  | "campaign.activated"
  | "campaign.completed"

  /* =========================
     MESSAGES (CHAT SYSTEM)
  ========================= */
  | "message.sent"
  | "message.delivered"
  | "message.read"
  | "message.blocked"

  /* =========================
     NOTIFICATIONS
  ========================= */
  | "notification.created"

  /* =========================
     MARKETPLACE / LISTINGS
  ========================= */
  | "listing.viewed"
  | "listing.created"
  | "listing.updated"

  /* =========================
     ESCROW / PAYMENTS
  ========================= */
  | "escrow.released"
  | "escrow.completed"

  /* =========================
     TRUST / MODERATION
  ========================= */
  | "user.warned"
  | "user.reported"
  | "moderation.required";

/* =========================
   APP EVENT PAYLOAD
========================= */
export interface AppEvent {
  type: EventType;

  data: {
    /* USERS */
    userId?: string;
    senderId?: string;
    receiverId?: string;

    /* CHAT */
    conversationId?: string;
    messageId?: string;
    content?: string;

    /* MARKETPLACE */
    listingId?: string;

    /* CAMPAIGNS */
    campaignId?: string;

    /* PAYMENTS */
    orderId?: string;

    /* NOTIFICATIONS */
    notificationId?: string;

    /* EXTENSIBLE META */
    meta?: Record<string, any>;
  };
}