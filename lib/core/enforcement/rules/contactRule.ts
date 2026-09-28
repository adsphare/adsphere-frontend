/**
 * Detect attempts to exchange external contact information.
 *
 * This rule is intentionally focused on CONTACT EXCHANGE rather than
 * merely mentioning a communication platform.
 *
 * Examples that should BLOCK:
 *   person@example.com
 *   person @ example . com
 *   person [at] example [dot] com
 *   +251 911 234 567
 *   0911-234-567
 *   WhatsApp me
 *   message me on Telegram
 *   instagram.com/myhandle
 *   @myhandle on Instagram
 *   t.me/myhandle
 *   wa.me/251...
 *   call me on 0911...
 *
 * Examples that should generally NOT BLOCK:
 *   Our Instagram campaign reached 50,000 views.
 *   Please publish the campaign on TikTok.
 *   The WhatsApp advertising placement runs for seven days.
 *   Our Facebook page has 100,000 followers.
 */

export function contactRule(content: string): boolean {
  if (typeof content !== "string" || !content.trim()) {
    return false;
  }

  const text = content.trim();

  /*
   * Normalize common Unicode/spacing tricks without destroying the
   * original text used for the more precise contextual rules.
   */
  const normalized = text
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[‐-‒–—−]/g, "-");

  /*
   * ---------------------------------------------------------------
   * 1. DIRECT EMAIL ADDRESS
   * ---------------------------------------------------------------
   */
  const directEmail =
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

  if (directEmail.test(normalized)) {
    return true;
  }

  /*
   * ---------------------------------------------------------------
   * 2. OBFUSCATED EMAIL
   * ---------------------------------------------------------------
   *
   * Examples:
   *   name @ gmail . com
   *   name [at] gmail [dot] com
   *   name at gmail dot com
   */
  const obfuscatedEmail =
    /\b[A-Z0-9._%+-]+\s*(?:@|\[?\s*(?:at|where)\s*\]?)\s*[A-Z0-9.-]+\s*(?:\.|\[?\s*(?:dot)\s*\]?)\s*[A-Z]{2,}\b/i;

  if (obfuscatedEmail.test(normalized)) {
    return true;
  }

  /*
   * ---------------------------------------------------------------
   * 3. PHONE NUMBERS
   * ---------------------------------------------------------------
   *
   * Require a phone-like structure instead of simply looking for
   * any 9-15 digit sequence. This avoids blocking campaign metrics,
   * prices, view counts, IDs, etc.
   *
   * Supports:
   *   +251911234567
   *   +251 911 234 567
   *   0911234567
   *   0911-234-567
   *   0911 234 567
   *   (0911) 234 567
   */
  const phonePatterns = [
    /(?:\+\d{1,3}[\s().-]*)?(?:\d[\s().-]*){9,14}\d/,
    /\(\d{2,4}\)[\s.-]*\d{3,4}[\s.-]*\d{3,4}/,
    /\b0\d{2,3}[\s.-]\d{3,4}[\s.-]\d{3,4}\b/,
  ];

  /*
   * Only consider the first phone pattern a match when the digit
   * count is within a realistic contact-number range.
   */
  for (const pattern of phonePatterns) {
    const matches = normalized.match(new RegExp(pattern.source, pattern.flags));

    if (!matches) {
      continue;
    }

    const digits = matches[0].replace(/\D/g, "");

    if (digits.length >= 9 && digits.length <= 15) {
      return true;
    }
  }

  /*
   * ---------------------------------------------------------------
   * 4. EXPLICIT CONTACT-EXCHANGE LANGUAGE
   * ---------------------------------------------------------------
   *
   * Platform names alone are not enough. We require language showing
   * an attempt to move the conversation or exchange contact details.
   */
  const contactExchangePatterns = [
    /\b(?:call|phone|ring)\s+(?:me|us|him|her|them)\b/i,
    /\b(?:text|sms|message)\s+(?:me|us|him|her|them)\b/i,
    /\b(?:contact|reach|reach out to)\s+(?:me|us|him|her|them)\b/i,
    /\b(?:send|give|share|drop)\s+(?:me|us)\s+(?:your|the)\s+(?:number|phone|email|contact)\b/i,
    /\bmy\s+(?:phone|mobile|cell|number|email|contact)\s+(?:is|:)\b/i,
    /\b(?:email|mail)\s+(?:me|us)\b/i,
    /\b(?:whatsapp|telegram|signal|snapchat|discord)\s+(?:me|us|here|on)\b/i,
    /\b(?:message|contact|find|reach)\s+me\s+on\s+(?:whatsapp|telegram|signal|snapchat|discord)\b/i,
    /\b(?:dm|direct message)\s+me\b/i,
    /\b(?:move|take)\s+(?:this|the|our)\s+(?:conversation|deal|transaction)\s+(?:to|off)\s+(?:whatsapp|telegram|email|instagram|facebook|tiktok)\b/i,
    /\b(?:deal|pay|payment|transaction)\s+(?:outside|off[- ]platform|directly)\b/i,
    /\b(?:pay|payment|send money|transfer)\s+(?:me|us)\s+(?:directly|outside|off[- ]platform)\b/i,
  ];

  if (contactExchangePatterns.some((pattern) => pattern.test(normalized))) {
    return true;
  }

  /*
   * ---------------------------------------------------------------
   * 5. DIRECT EXTERNAL CONTACT LINKS
   * ---------------------------------------------------------------
   *
   * A bare platform mention is not enough. A contact/profile/link
   * pattern is strong evidence of off-platform contact exchange.
   */
  const externalContactLinks = [
    /\b(?:https?:\/\/)?(?:www\.)?wa\.me\/[^\s]+/i,
    /\b(?:https?:\/\/)?(?:www\.)?t\.me\/[^\s]+/i,
    /\b(?:https?:\/\/)?(?:www\.)?telegram\.me\/[^\s]+/i,
    /\b(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s]+/i,
    /\b(?:https?:\/\/)?(?:www\.)?facebook\.com\/[^\s]+/i,
    /\b(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[^\s]+/i,
    /\b(?:https?:\/\/)?(?:www\.)?discord\.gg\/[^\s]+/i,
  ];

  if (externalContactLinks.some((pattern) => pattern.test(normalized))) {
    return true;
  }

  /*
   * ---------------------------------------------------------------
   * 6. SOCIAL HANDLE + EXCHANGE CONTEXT
   * ---------------------------------------------------------------
   *
   * Do not block every @username because legitimate campaign copy
   * can contain mentions. Require contact/exchange context.
   */
  const socialHandleExchange =
    /\b(?:follow|find|add|contact|message|dm|reach)\s+(?:me|us)\s+(?:at|on)\s+@[a-z0-9._-]{2,}\b/i;

  if (socialHandleExchange.test(normalized)) {
    return true;
  }

  /*
   * ---------------------------------------------------------------
   * 7. COMMON OBFUSCATED EMAIL DOMAINS
   * ---------------------------------------------------------------
   *
   * These patterns catch:
   *   @ gmail
   *   @ yahoo
   *   gmail dot com
   *
   * Only block when they appear in contact-oriented context.
   */
  const obfuscatedDomainWithContext =
    /\b(?:email|mail|contact|reach|send|write)\b.{0,40}\b(?:gmail|yahoo|outlook|hotmail)\b/i;

  if (obfuscatedDomainWithContext.test(normalized)) {
    return true;
  }

  return false;
}
