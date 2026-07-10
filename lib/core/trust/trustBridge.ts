import { eventBus } from "@/lib/core/events";
import { trustScore } from "./trustScore";

import type { EventType } from "@/lib/core/events";
import type { TrustEvent } from "./trustScore";


/* =========================
   CONVERTER
========================= */
function toTrustEvent(
  eventType: EventType
): TrustEvent | null {

  switch (eventType) {

    case "message_sent":
      return "message_sent";


    case "escrow_released":
      return "escrow_completed";


    case "listing_viewed":
      return "listing_viewed";


    case "message_blocked":
      return "message_blocked";


    case "user_reported":
      return "user_reported";


    case "dispute_won":
      return "dispute_won";


    case "dispute_lost":
      return "dispute_lost";


    default:
      return null;

  }

}



/* =========================
   EVENT LISTENER
========================= */

eventBus.on(async (event) => {

  try {

    const {
      type,
      data
    } = event;


    const trustEvent =
      toTrustEvent(type);



    if (
      data?.senderId &&
      trustEvent
    ) {

      await trustScore.applyEvent(
        data.senderId,
        trustEvent
      );

    }



    /*
      Escrow completion:
      receiver delivered value
    */

    if (
      type === "escrow_released" &&
      data?.receiverId
    ) {

      await trustScore.increase(
        data.receiverId,
        2
      );

    }


  } catch(error) {


    console.error(
      "TRUST BRIDGE ERROR:",
      error
    );


  }

});
