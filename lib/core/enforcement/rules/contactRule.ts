/**
 * Detects attempts to share external contact info
 * (WhatsApp, email, phone, social links, etc.)
 */
export function contactRule(content: string): boolean {
  if (!content) return false;

  const patterns = [
    // emails
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,

    // phone numbers (intl + local patterns)
    /\+?\d{9,15}/,

    // social / messaging platforms
    /instagram\.com/i,
    /t\.me/i,
    /wa\.me/i,
    /whatsapp/i,
    /snapchat/i,
    /discord\.gg/i,
    /facebook\.com/i,
    /tiktok\.com/i,

    // "hidden" patterns
    /@gmail/i,
    /@yahoo/i,
    /dot com/i,
  ];

  return patterns.some((regex) => regex.test(content));
}

