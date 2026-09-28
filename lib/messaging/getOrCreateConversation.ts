export async function getOrCreateConversation({
  listingId,
}: {
  listingId: string;
}) {
  const response = await fetch("/api/conversations/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      listingId,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof payload?.error === "string"
        ? payload.error
        : "Failed to create conversation"
    );
  }

  return payload;
}
