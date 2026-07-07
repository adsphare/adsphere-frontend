import { eventBus } from "@/lib/core/events";
import { notification } from "@/lib/core/notifications";

/* =========================
   MESSAGE NOTIFICATIONS
========================= */
eventBus.on(async (event) => {
  if (event.type === "message_sent") {
    const receiverId = event.data.receiverId;
    const senderId = event.data.senderId;
    const content = event.data.content;
    const conversationId = event.data.conversationId;

    // 🛑 SAFE GUARDS (FIX TYPESCRIPT ERROR)
    if (!receiverId || !senderId || !content || !conversationId) return;

    await notification.create({
      userId: receiverId,
      title: "New Message",
      message: content,
      type: "chat",
      data: {
        conversationId,
        senderId,
      },
    });
  }
});

