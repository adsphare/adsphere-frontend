import { eventBus } from "@/lib/core/events";
import { toastBus } from "./toast";

eventBus.on((event) => {

  /* =========================
     CHAT TOAST
  ========================= */
  if (event.type === "message_sent") {
    toastBus.emit({
      id: crypto.randomUUID(),
      type: "chat",
      title: "New Message",
      message: event.data.content ?? "New message",
    });
  }

  /* =========================
     PAYMENT TOAST
  ========================= */
  if (event.type === "escrow_released") {
    toastBus.emit({
      id: crypto.randomUUID(),
      type: "payment",
      title: "Payment Released",
      message: "Funds released successfully",
    });
  }

  /* =========================
     LISTING TOAST
  ========================= */
  if (event.type === "listing_viewed") {
    toastBus.emit({
      id: crypto.randomUUID(),
      type: "listing",
      title: "Listing Activity",
      message: "Someone viewed your listing",
    });
  }
});

