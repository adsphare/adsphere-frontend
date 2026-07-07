import { AppEvent } from "@/lib/core/events";

type Listener = (event: AppEvent) => void;

class EventBus {
  private listeners: Listener[] = [];

  on(listener: Listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(event: AppEvent) {
    this.listeners.forEach((listener) => listener(event));
  }
}

export const eventBus = new EventBus();

