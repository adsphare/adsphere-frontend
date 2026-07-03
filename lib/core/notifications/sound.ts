type SoundType = "chat" | "payment" | "system" | "listing";

const sounds: Record<SoundType, string> = {
  chat: "/sounds/chat.mp3",
  payment: "/sounds/payment.mp3",
  system: "/sounds/system.mp3",
  listing: "/sounds/listing.mp3",
};

let enabled = true;

export const soundSystem = {
  enable() {
    enabled = true;
  },

  disable() {
    enabled = false;
  },

  play(type: SoundType) {
    if (!enabled) return;

    const src = sounds[type];
    if (!src) return;

    const audio = new Audio(src);
    audio.volume = 0.6;

    audio.play().catch(() => {
      // browsers block autoplay until user interaction
    });
  },
};