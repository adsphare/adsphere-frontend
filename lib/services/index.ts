import { listingService } from "./listing.service";
import { chat } from "@/lib/core/chat";
import { notification } from "@/lib/core/notifications"
import { escrowService } from "./escrowService"

export const services = {
  listing: listingService,
  chat,
  notification,
  escrow: escrowService,
};

