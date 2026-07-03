"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/core/db";

export default function ActivityPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, []);

  async function loadActivity() {
    try {
      const { data: userData } = await db.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Get listing IDs
      const { data: listings } = await db
        .from("listings")
        .select("id")
        .eq("user_id", user.id);

      const listingIds = listings?.map((l) => l.id) || [];

      // 2. Views / analytics
      const { data: views } = await db
        .from("analytics_events")
        .select("*")
        .in("listing_id", listingIds)
        .order("created_at", { ascending: false });

      // 3. Messages activity
      const { data: messages } = await db
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      // 4. Merge events
      const merged = [
        ...(views || []).map((v) => ({
          type: "view",
          text: "Someone viewed your listing",
          time: v.created_at,
        })),
        ...(messages || []).map((m) => ({
          type: "message",
          text: "New message received",
          time: m.created_at,
        })),
      ];

      merged.sort(
        (a, b) =>
          new Date(b.time).getTime() - new Date(a.time).getTime()
      );

      setEvents(merged);
    } catch (err) {
      console.error("Activity load error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-white">Loading activity...</div>
    );
  }

  return (
    <div className="p-6 text-white">

      <h1 className="text-2xl font-bold mb-6">Activity</h1>

      {events.length === 0 && (
        <p className="text-gray-400">No activity yet.</p>
      )}

      <div className="space-y-3">
        {events.map((e, i) => (
          <div
            key={i}
            className="p-4 bg-white/5 border border-white/10 rounded-xl"
          >
            <p className="text-white">{e.text}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(e.time).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}