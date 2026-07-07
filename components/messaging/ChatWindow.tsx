"use client";

export default function ChatWindow({ messages }: { messages: any[] }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((m) => (
        <div
          key={m.id}
          className="bg-white/10 p-3 rounded-lg text-white"
        >
          {m.content}
        </div>
      ))}
    </div>
  );
}

