import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingBubble from "./TypingBubble";

const MessageList = ({ messages, pending }) => {
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/40">
      {messages.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center text-slate-500 dark:text-slate-400">
          Ask me anything…
        </div>
      ) : (
        messages.map((m, i) => <MessageBubble key={i} role={m.role} content={m.content} />)
      )}
      {pending && <TypingBubble />}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
