"use client";

import { useState } from "react";

export default function MessageInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  return (
    <div className="p-3 border-t border-white/10 flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-3 bg-black/40 rounded-lg"
        placeholder="Type message..."
      />

      <button
        onClick={send}
        className="px-5 py-3 bg-blue-600 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}