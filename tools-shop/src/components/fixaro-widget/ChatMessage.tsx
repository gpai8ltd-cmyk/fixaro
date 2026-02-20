"use client";
import type { WidgetMessage } from "./widget.types";

interface ChatMessageProps {
  message: WidgetMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.source === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "text-white rounded-br-md"
            : "bg-slate-50 text-slate-900 border border-slate-100 rounded-bl-md"
        }`}
        style={isUser ? { backgroundColor: "#84cc16" } : undefined}
      >
        {message.text}
      </div>
    </div>
  );
}
