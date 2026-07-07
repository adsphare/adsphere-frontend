import { registerMessageEvents } from "@/lib/events/message.events";

export function initEvents() {
  console.log("[Event System Initialized]");

  registerMessageEvents();
}






