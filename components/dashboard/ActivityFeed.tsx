"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Activity = {
  id: string;
  user_id: string;
  event_type?: string;
  action?: string;
  description?: string;
  created_at: string;
};

export default function ActivityFeed() {
  const db = createBrowserSupabase();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadActivity();
  }, []);

  async function loadActivity() {
    try {
      const { data: userData } = await db.auth.getUser();

      const user = userData?.user;

      if (!user) {
        setActivities([]);
        return;
      }

      const { data, error } = await db
        .from("analytics_events")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(10);

      if (error) {
        console.error(
          "Activity load error:",
          error.message
        );
        return;
      }

      setActivities(
        (data as Activity[]) || []
      );

    } catch (error) {
      console.error(
        "Activity error:",
        error
      );

    } finally {
      setLoading(false);
    }
  }


  if (loading) {
    return (
      <div className="text-white/50">
        Loading activity...
      </div>
    );
  }


  if (activities.length === 0) {
    return (
      <div className="text-white/50">
        No recent activity
      </div>
    );
  }


  return (
    <div className="space-y-3">

      {activities.map((item) => (
        <div
          key={item.id}
          className="
            p-4
            rounded-xl
            border
            border-white/10
            bg-white/5
          "
        >

          <div className="font-medium">
            {item.action ||
              item.event_type ||
              "Activity"}
          </div>


          {item.description && (
            <p className="text-sm text-white/50 mt-1">
              {item.description}
            </p>
          )}


          <p className="text-xs text-white/30 mt-2">
            {new Date(
              item.created_at
            ).toLocaleString()}
          </p>

        </div>
      ))}

    </div>
  );
}