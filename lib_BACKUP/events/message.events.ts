import { eventBus } from "@/lib/events/eventBus";

export function registerMessageEvents() {
  // MESSAGE SENT
  eventBus.on("message.sent", (msg: any) => {
    console.log("[MessageSent]", msg);

    // simulate delivery
    eventBus.emit("message.delivered", {
      messageId: msg.id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      conversationId: msg.conversationId,
    });
  });

  // MESSAGE DELIVERED
  eventBus.on("message.delivered", (msg: any) => {
    console.log("[MessageDelivered]", msg);
  });

  // MESSAGE READ
  eventBus.on("message.read", (msg: any) => {
    console.log("[MessageRead]", msg);
  });
}






