export function sanitizeMessage(text: string) {
  if (!text) return text;

  return text
    .replace(/\b\d{8,}\b/g, "[blocked-number]")
    .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, "[blocked-email]")
    .replace(
      /(https?:\/\/|www\.|wa\.me|whatsapp|telegram|t\.me)/gi,
      "[blocked-link]"
    );
}