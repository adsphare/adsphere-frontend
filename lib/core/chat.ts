import { db } from "@/lib/core/db";
import { eventBus } from "@/lib/core/events";

import { evaluateMessage } from "@/lib/core/enforcement/policyEngine";
import { handleEnforcement } from "@/lib/core/enforcement/actionHandler";

/* =========================
   TYPES
========================= */

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type MessagePreview = {
  id: string;
  sender_id: string;
  created_at: string;
};

/* =========================
   CHAT SERVICE
========================= */

export const chat = {
  /* =========================
     GET USER
  ========================= */
  async getUser() {
    const { data } = await db.auth.getUser();
    return data?.user || null;
  },

  /* =========================
     GET CONVERSATION
  ========================= */
  async getConversation(conversationId: string) {
    const { data, error } = await db
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /* =========================
     GET MESSAGES
  ========================= */
  async getMessages(conversationId: string) {
    const { data, error } = await db
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []) as Message[];
  },

  /* =========================
     GET INBOX
  ========================= */
  async getInbox(userId: string) {
    const { data, error } = await db
      .from("conversations")
      .select("*")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data ?? [];
  },

  /* =========================
     MARK AS READ
  ========================= */
  async markAsRead(conversationId: string, userId: string) {
    const { error } = await db
      .from("conversations")
      .update({
        last_read_at: new Date().toISOString(),
        last_read_by: userId,
      })
      .eq("id", conversationId);

    if (error) throw new Error(error.message);
  },

  /* =========================
     UNREAD COUNT (FIXED TYPES)
  ========================= */
  async getUnreadCount(conversationId: string, userId: string) {
    const { data: messages, error } = await db
      .from("messages")
      .select("id, sender_id, created_at")
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId);

    if (error) throw new Error(error.message);

    const { data: convo } = await db
      .from("conversations")
      .select("last_read_at")
      .eq("id", conversationId)
      .single();

    const msgList: MessagePreview[] = (messages || []) as MessagePreview[];

    if (!convo?.last_read_at) return msgList.length;

    const unread = msgList.filter((m) => {
      return (
        new Date(m.created_at).getTime() >
        new Date(convo.last_read_at).getTime()
      );
    });

    return unread.length;
  },

  /* =========================
     SEND MESSAGE (ENFORCED CORE)
  ========================= */
  async sendMessage({
    conversationId,
    senderId,
    content,
  }: {
    conversationId: string;
    senderId: string;
    content: string;
  }) {
    // 1. LOAD CONVERSATION
    const { data: convo, error: convoError } = await db
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (convoError || !convo) {
      throw new Error("Conversation not found");
    }

    // 2. DETERMINE RECEIVER
    const receiverId =
      senderId === convo.buyer_id ? convo.seller_id : convo.buyer_id;

    // 3. POLICY CHECK
    const decision = await evaluateMessage({
      userId: senderId,
      conversationId,
      content,
      orderId: convo.order_id || convo.id,
    });

    const allowed = handleEnforcement(decision, {
      userId: senderId,
      conversationId,
      content,
    });

    if (!allowed) {
      throw new Error("Message blocked by AdSphera Enforcement System");
    }

    // 4. INSERT MESSAGE
    const { data, error } = await db
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // 5. EVENT SYSTEM
    eventBus.emit({
      type: "message_sent",
      data: {
        conversationId,
        senderId,
        receiverId,
        content,
        listingId: convo.listing_id,
      },
    });

    return data;
  },

  /* =========================
     REALTIME SUBSCRIPTION
  ========================= */
  subscribe(conversationId: string, callback: (msg: Message) => void) {
    const channel = db
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      db.removeChannel(channel);
    };
  },
};