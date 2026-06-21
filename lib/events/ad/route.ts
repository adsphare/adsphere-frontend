import { trackAdEvent } from "@/lib/events/adEvents";

export async function POST(req: Request) {
  const body = await req.json();

  const { listingId, type } = body;

  if (!listingId || !type) {
    return Response.json(
      { error: "Invalid event" },
      { status: 400 }
    );
  }

  const result = await trackAdEvent({
    listingId,
    type,
  });

  return Response.json(result);
}