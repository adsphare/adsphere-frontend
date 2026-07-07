import { chat } from "@/lib/core/chat";
import { db } from "@/lib/core/db";

export const messageService = {
  async load(conversationId: string) {
    return chat.getMessages(conversationId);
  },

  async send(conversationId: string, senderId: string, content: string) {
    return chat.sendMessage({
      conversationId,
      senderId,
      content,
    });
  },

  subscribe(conversationId: string, callback: (msg: any) => void) {
    return chat.subscribe(conversationId, callback);
  },

  async getUser() {
    const { data } = await db.auth.getUser();
    return data?.user || null;
  },
};

