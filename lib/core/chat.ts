
import { db } from "@/lib/core/db";
import { eventBus } from "@/lib/core/events";


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
    const { data: userData, error: authError } =
      await db.auth.getUser();

    if (authError || !userData.user) {
      throw new Error("UNAUTHORIZED");
    }

    if (userData.user.id !== userId) {
      throw new Error("USER_MISMATCH");
    }

    const response = await fetch(
      "/api/conversations/read",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
        }),
      }
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        result?.error || "CONVERSATION_READ_FAILED"
      );
    }

    return result;
  },

  /* =========================
     UNREAD COUNT
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
     SEND MESSAGE
  ========================= */
  async sendMessage({
    conversationId,
    content,
  }: {
    conversationId: string;
    content: string;
  }) {
    const {
      data: { user },
      error: userError,
    } = await db.auth.getUser();

    if (userError || !user) {
      throw new Error("Authentication required");
    }

    const senderId = user.id;

    const { data: convo, error: convoError } = await db
      .from("conversations")
      .select("id, buyer_id, seller_id, owner_id, listing_id")
      .eq("id", conversationId)
      .single();

    if (convoError || !convo) {
      throw new Error("Conversation not found");
    }

    const isParticipant =
      convo.buyer_id === senderId ||
      convo.seller_id === senderId ||
      convo.owner_id === senderId;

    if (!isParticipant) {
      throw new Error("Not authorized for this conversation");
    }

    const receiverId =
      senderId === convo.buyer_id ? convo.seller_id : convo.buyer_id;
/*
     * Canonical message creation path.
     *
     * The API route authenticates the user and delegates the
     * actual write to the atomic database transaction:
     *
     *   messages
     *   trust_events
     *   profiles.trust_score
     *
     * No direct message INSERT or legacy trust RPC is performed here.
     */
    const response = await fetch("/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        content,
        type: "chat",
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        typeof result?.error === "string"
          ? result.error
          : "Message send failed"
      );
    }

    const data = result?.message;

    if (!data?.id) {
      throw new Error("Message creation returned an invalid response");
    }

    eventBus.emit({
      type: "message_sent",
      data: {
        messageId: data.id,
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
  subscribe(
    conversationId: string,
    callback: (msg: Message) => void
  ) {
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




