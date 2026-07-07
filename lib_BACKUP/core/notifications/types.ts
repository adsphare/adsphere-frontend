/* =========================
   NOTIFICATION TYPES
========================= */

/**
 * Core notification categories in AdSphera marketplace
 * Keep this SMALL and controlled (important for scaling + trust system)
 */
export type NotificationType =
  | "chat"
  | "payment"
  | "system"
  | "listing"
  | "trust"
  | "escrow"
  | "moderation";

/**
 * Notification entity stored in DB
 */
export type Notification = {
  id: string;
  user_id: string;

  title: string;
  message: string;

  type: NotificationType;

  read: boolean;

  created_at: string;

  /**
   * Optional deep link inside app
   * example: /chat/123 or /listing/abc
   */
  action_url?: string | null;

  /**
   * Optional metadata for advanced systems
   * (trust score changes, escrow info, etc.)
   */
  meta?: Record<string, any>;
};

