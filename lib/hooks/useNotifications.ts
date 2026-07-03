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
    // temporary implementation (safe for build)
    console.log("Notification:", {
      userId,
      type,
      title,
      message,
    });

    return true;
  },
};