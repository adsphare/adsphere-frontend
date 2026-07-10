import { createBrowserClient } from "@supabase/ssr";

function supabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export async function createNotification({
  userId,
  title,
  message,
  type = "info",
}: {
  userId: string;
  title: string;
  message: string;
  type?: string;
}) {
  const sb = supabase();

  const { error } = await sb.from("notifications").insert([
    {
      user_id: userId,
      title,
      message,
      type,
      read: false,
    },
  ]);

  if (error) {
    console.error("createNotification error:", error);
  }
}






