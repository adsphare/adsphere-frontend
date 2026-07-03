import { eventBus } from "@/lib/core/events";
import { notification } from "./index";

eventBus.on(async (event) => {

  /* =========================
     MESSAGE SENT
  ========================= */
  if (event.type === "message_sent") {
    if (!event.data.receiverId) return;

    await notification.create({
      userId: event.data.receiverId,
      title: "New Message",
      message: event.data.content ?? "You received a message",
      type: "chat",
    });
  }

  /* =========================
     LISTING VIEWED
  ========================= */
  if (event.type === "listing_viewed") {
    if (!event.data.ownerId) return;

    await notification.create({
      userId: event.data.ownerId,
      title: "Listing Viewed",
      message: "Someone viewed your listing",
      type: "listing",
    });
  }

  /* =========================
     ESCROW RELEASED
  ========================= */
  if (event.type === "escrow_released") {
    if (!event.data.userId) return;

    await notification.create({
      userId: event.data.userId,
      title: "Payment Released",
      message: "Funds have been released",
      type: "payment",
    });
  }

});