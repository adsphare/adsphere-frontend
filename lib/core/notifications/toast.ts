type Toast = {
  id: string;
  title: string;
  message: string;
  type: "chat" | "payment" | "system" | "listing" | "trust";
};

type Listener = (toast: Toast) => void;

class ToastBus {
  private listeners: Listener[] = [];

  /**
   * Register a listener
   */
  on(listener: Listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Alias for compatibility
   */
  subscribe(listener: Listener) {
    return this.on(listener);
  }

  /**
   * Emit a toast
   */
  emit(toast: Toast) {
    this.listeners.forEach((listener) => listener(toast));
  }

  /**
   * Convenience helper
   */
  show(toast: Omit<Toast, "id">) {
    this.emit({
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Date.now().toString(),
      ...toast,
    });
  }
}

export const toastBus = new ToastBus();

export type { Toast };