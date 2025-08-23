import React from "react";

// Assistant-style bubble with animated three-dot typing indicator
const TypingBubble = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[75%] rounded-2xl px-3 py-2 shadow-md bg-white dark:bg-slate-800/70 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-bl-sm">
        <div className="flex items-center gap-1 h-5">
          <span className="typing-dot" />
          <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
          <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
    </div>
  );
};

export default TypingBubble;
