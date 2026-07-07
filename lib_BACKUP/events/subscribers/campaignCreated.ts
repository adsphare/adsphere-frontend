export const notificationService = {
  async create({
    userId,
    type,
    title,
    message,
  }: {
    userId: string;
    type: string;
    title: string;
    message: string;
  }) {
    // replace with supabase or db later
    console.log("Notification:", {
      userId,
      type,
      title,
      message,
    });

    return true;
  },
};

