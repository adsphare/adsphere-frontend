"use client";

type Props = {
  content: string;
  isMine: boolean;
  createdAt?: string;
};

export default function MessageBubble({
  content,
  isMine,
  createdAt,
}: Props) {
  return (
    <div
      className={`flex flex-col max-w-[75%] ${
        isMine ? "ml-auto items-end" : "items-start"
      }`}
    >
      <div
        className={`
          px-4 py-2 rounded-2xl text-sm shadow-sm
          ${
            isMine
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-white/10 text-white rounded-bl-sm"
          }
        `}
      >
        {content}
      </div>

      {createdAt && (
        <span className="text-[10px] text-white/40 mt-1">
          {new Date(createdAt).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

