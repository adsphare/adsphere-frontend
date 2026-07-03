import { eventBus } from "@/lib/core/events";
import { trustScore } from "./trustScore";
import type { EventType } from "@/lib/core/events";
import type { TrustEvent } from "./trustScore";

/* =========================
   CONVERTER FUNCTION
========================= */
function toTrustEvent(eventType: EventType): TrustEvent | null {
  switch (eventType) {
    case "message_sent":
      return "message_sent";

    case "escrow_released":
      return "escrow_completed";

    case "listing_viewed":
      return "listing_viewed";

    case "message_blocked":
      return "message_blocked";

    case "user_reported":
      return "user_reported";

    default:
      return null;
  }
}

/* =========================
   EVENT LISTENER
========================= */
eventBus.on(async (event) => {
  const { type, data } = event;

  const trustEvent = toTrustEvent(type);

  if (data?.senderId && trustEvent) {
    await trustScore.applyEvent(data.senderId, trustEvent);
  }

  if (type === "escrow_released" && data?.receiverId) {
    await trustScore.increase(data.receiverId, 2);
  }
});