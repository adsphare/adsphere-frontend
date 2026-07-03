export type EventType =
  | "message_sent"
  | "listing_viewed"
  | "escrow_released"
  | "escrow_completed"
  | "message_blocked"
  | "user_warned"
  | "user_reported"
  | "moderation_required"
  | "notification_created";

/* =========================
   BASE EVENT STRUCTURE
========================= */
export type AppEvent = {
  type: EventType;
  data: {
    userId?: string;
    senderId?: string;
    receiverId?: string;
    conversationId?: string;
    listingId?: string;
    content?: string;
    [key: string]: any;
  };
};

/* =========================
   LISTENER TYPE
========================= */
type Listener = (event: AppEvent) => void;

/* =========================
   EVENT BUS CORE
========================= */
class EventBus {
  private listeners: Listener[] = [];

  on(listener: Listener) {
    this.listeners.push(listener);

    // unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(event: AppEvent) {
    this.listeners.forEach((listener) => listener(event));
  }
}

/* =========================
   SINGLETON INSTANCE
========================= */
export const eventBus = new EventBus();