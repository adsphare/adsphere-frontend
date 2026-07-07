"use client";

import { eventBus } from "@/lib/events/eventBus";

export default function TestPage() {
  const sendMessage = () => {
    eventBus.emit("message.sent", {
      id: "1",
      senderId: "user1",
      receiverId: "user2",
      conversationId: "chat1",
      content: "Hello",
    });
  };

  return (
    <div className="p-10">
      <button
        onClick={sendMessage}
        className="px-4 py-2 bg-blue-600 rounded"
      >
        Send Test Message
      </button>
    </div>
  );
}






