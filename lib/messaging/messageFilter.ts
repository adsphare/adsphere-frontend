/* ==========================================
   Adspheria Message Lock Filter
========================================== */

const BLOCKED_PATTERNS = [
  // Email
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,

  // Phone Numbers
  /\+?\d[\d\s\-()]{7,}\d/g,

  // URLs
  /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi,

  // WhatsApp
  /\bwhatsapp\b/i,

  // Telegram
  /\btelegram\b/i,

  // Discord
  /\bdiscord\b/i,

  // Signal
  /\bsignal\b/i,

  // Instagram
  /\binstagram\b/i,

  /\binsta\b/i,

  // TikTok
  /\btiktok\b/i,

  // Snapchat
  /\bsnapchat\b/i,

  // WeChat
  /\bwechat\b/i,

  // Contact keywords
  /\bemail\b/i,
  /\bphone\b/i,
  /\bcall me\b/i,
  /\btext me\b/i,
  /\bcontact me\b/i,
];

export function containsBlockedContent(message: string) {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(message));
}

export function sanitizeMessage(message: string) {
  if (!containsBlockedContent(message)) {
    return {
      blocked: false,
      text: message.trim(),
    };
  }

  return {
    blocked: true,
    text:
      "🔒 Contact information is locked until a deal has been accepted through Adspheria.",
  };
}