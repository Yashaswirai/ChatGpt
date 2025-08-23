import React from "react";

const ChatHeader = ({ title = "New Chat" }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
      <div className="flex items-center gap-2 select-none">
        <div className="h-3 w-3 rounded-sm bg-sky-500 shadow-[0_0_20px] shadow-sky-500/40" />
        <h2 className="font-semibold tracking-wide text-slate-700 dark:text-slate-300">
          {title}
        </h2>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">Connected</div>
    </header>
  );
};

export default ChatHeader;
