"use client";

import { useState } from "react";

type Props = {
  onSend: (text: string) => void | Promise<void>;
  onTyping?: () => void;
};

export default function MessageInput({ onSend, onTyping }: Props) {
  const [text, setText] = useState("");

  async function handleSend() {
    if (!text.trim()) return;

    await onSend(text);
    setText("");
  }

  return (
    <div className="p-3 border-t border-white/10 flex gap-2 bg-black/40">

      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onTyping?.(); // ✅ FIXED
        }}
        className="flex-1 p-3 bg-black/50 rounded-lg outline-none text-white"
        placeholder="Type a message..."
      />

      <button
        onClick={handleSend}
        className="px-5 py-3 bg-blue-600 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}