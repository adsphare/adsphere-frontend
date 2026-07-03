import { eventBus } from "@/lib/core/events";
import { trustScore } from "./trustScore";

eventBus.on(async (event) => {

  const { type, data } = event;

  /* =========================
     MESSAGE EVENTS
  ========================= */
  if (type === "message_sent") {
    if (data.senderId) {
      await trustScore.applyEvent(data.senderId, "message_sent");
    }
  }

  /* =========================
     ESCROW SUCCESS
  ========================= */
  if (type === "escrow_released") {
    if (data.senderId) {
      await trustScore.applyEvent(data.senderId, "escrow_completed");
    }

    if (data.receiverId) {
      await trustScore.applyEvent(data.receiverId, "escrow_completed");
    }
  }

  /* =========================
     LISTING VIEW
  ========================= */
  if (type === "listing_viewed") {
    if (data.userId) {
      await trustScore.applyEvent(data.userId, "listing_viewed" as any);
    }
  }

  /* =========================
     ENFORCEMENT EVENTS
  ========================= */
  if (type === "message_blocked") {
    if (data.senderId) {
      await trustScore.applyEvent(data.senderId, "message_blocked");
    }
  }

  if (type === "user_warned") {
    if (data.userId) {
      await trustScore.applyEvent(data.userId, "user_reported");
    }
  }
});