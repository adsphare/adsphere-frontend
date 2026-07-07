import { subscribeNotifications } from "./realtime";
import { soundSystem } from "./sound";
import { toastBus } from "./toast";

export const notification = {
  subscribe: subscribeNotifications,
  sound: soundSystem,
  toast: toastBus,

  create: async (payload: any) => {
    console.log("notification.create:", payload);
    return { success: true };
  },
};

