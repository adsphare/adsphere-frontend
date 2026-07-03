export type Listener = (payload: any) => void;

class EventBus {
  private listeners: Record<string, Listener[]> = {};

  on(event: string, handler: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  emit(event: string, payload?: any) {
    const handlers = this.listeners[event];
    if (!handlers) return;

    handlers.forEach((h) => h(payload));
  }
}

export const eventBus = new EventBus();





