import { createServerSupabase } from "@/lib/supabase/server";
import { createNotification } from "@/lib/notifications/notifications";
import { NotificationTypes } from "@/lib/notifications/types";

/* =========================
   SEND MESSAGE
========================= */
export async function sendMessage({
  conversationId,
  senderId,
  message,
}: {
  conversationId: string;
  senderId: string;
  message: string;
}) {
  const supabase = createServerSupabase();

  const text = message?.trim();
  if (!conversationId || !senderId || !text) return;

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: senderId,
    message: text,
    created_at: new Date().toISOString(),
    read: false,
  });

  if (error) throw error;

  const { data: conversation } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (!conversation) return;

  const receiverId =
    senderId === conversation.owner_id
      ? conversation.buyer_id
      : conversation.owner_id;

  await supabase
    .from("conversations")
    .update({
      last_message: text,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  await createNotification({
    userId: receiverId,
    title: "New Message",
    message: text,
    type: NotificationTypes.MESSAGE,
    link: `/messages/${conversationId}`,
  });
}

/* =========================
   SEND OFFER
========================= */
export async function sendOffer({
  conversationId,
  senderId,
  amount,
}: {
  conversationId: string;
  senderId: string;
  amount: number;
}) {
  const supabase = createServerSupabase();

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: senderId,
    message: `💰 Offer: $${amount}`,
    offer_amount: amount,
    offer_status: "pending",
    created_at: new Date().toISOString(),
  });

  if (error) throw error;

  const { data: conversation } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (!conversation) return;

  await createNotification({
    userId: conversation.owner_id,
    title: "New Offer",
    message: `You received a $${amount} offer`,
    type: NotificationTypes.OFFER,
    link: `/messages/${conversationId}`,
  });
}

/* =========================
   ACCEPT OFFER → CREATE DEAL
========================= */
export async function acceptOfferCreateDeal({
  message,
  conversation,
}: {
  message: any;
  conversation: any;
}) {
  const supabase = createServerSupabase();

  const { data: existing } = await supabase
    .from("deals")
    .select("*")
    .eq("conversation_id", conversation.id)
    .eq("amount", message.offer_amount)
    .maybeSingle();

  if (existing) return existing;

  const { data: deal, error } = await supabase
    .from("deals")
    .insert({
      listing_id: conversation.listing_id,
      conversation_id: conversation.id,
      buyer_id: conversation.buyer_id,
      owner_id: conversation.owner_id,
      amount: message.offer_amount,
      status: "pending",
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from("messages")
    .update({ offer_status: "accepted" })
    .eq("id", message.id);

  await supabase
    .from("conversations")
    .update({
      last_message: `Deal: $${message.offer_amount}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversation.id);

  await createNotification({
    userId: conversation.buyer_id,
    title: "Deal Created",
    message: "Your offer was accepted",
    type: NotificationTypes.DEAL,
    link: `/deals/${deal.id}`,
  });

  await createNotification({
    userId: conversation.owner_id,
    title: "Deal Created",
    message: "You accepted an offer",
    type: NotificationTypes.DEAL,
    link: `/deals/${deal.id}`,
  });

  return deal;
}

/* optional alias */
export const createDeal = acceptOfferCreateDeal;





