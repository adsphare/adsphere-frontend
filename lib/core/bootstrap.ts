import { eventBus } from "@/lib/core/events";
import { notification } from "@/lib/core/notifications";

/* =========================
   MESSAGE EVENTS
========================= */
eventBus.on(async (event) => {
  const data = event.data as any;

  if (event.type === "message_sent") {
    if (!data?.receiverId || !data?.content) return;

    await notification.create({
      userId: data.receiverId,
      title: "New Message",
      message: data.content,
      type: "chat",
    });
  }

  if (event.type === "listing_viewed") {
    if (!data?.ownerId) return;

    await notification.create({
      userId: data.ownerId,
      title: "Listing Viewed",
      message: "Someone viewed your listing",
      type: "listing",
    });
  }

  if (event.type === "escrow_released") {
    if (!data?.userId) return;

    await notification.create({
      userId: data.userId,
      title: "Payment Released",
      message: "Funds have been released",
      type: "payment",
    });
  }
});