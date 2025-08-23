import React from "react";

const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap shadow-md ${
          isUser
            ? "bg-sky-600 text-white rounded-br-sm"
            : "bg-white dark:bg-slate-800/70 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-bl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default MessageBubble;
