"use client";

import MessageBubble from "./MessageBubble";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type Props = {
  messages: Message[];
  userId: string | null;
};

export default function ChatWindow({ messages, userId }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          content={msg.content}
          isMine={msg.sender_id === userId}
          createdAt={msg.created_at}
        />
      ))}
    </div>
  );
}