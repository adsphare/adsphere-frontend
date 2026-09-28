import { chat } from "@/lib/core/chat";
import { createBrowserSupabase } from "@/lib/supabase";

export const messageService = {
  async load(conversationId: string) {
    return chat.getMessages(conversationId);
  },

  async send(
    conversationId: string,
    content: string
  ) {
    return chat.sendMessage({
      conversationId,
      content,
    });
  },

  subscribe(
    conversationId: string,
    callback: (msg: any) => void
  ) {
    return chat.subscribe(conversationId, callback);
  },

  async getUser() {
    const supabase = createBrowserSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user ?? null;
  },
};



