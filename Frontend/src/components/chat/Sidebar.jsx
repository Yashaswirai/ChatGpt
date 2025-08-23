import React from "react";

const Sidebar = ({ onNewChat, chats = [], activeId, onSelect }) => {
  return (
    <aside className="hidden md:flex md:flex-col w-64 h-full border-r border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40">
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-lg py-2"
        >
          + New Chat
        </button>
      </div>
      <div className="px-3 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Recent</div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {chats.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400 px-2">No chats yet</div>
        )}
        {chats.map((c) => (
          <button
            key={c._id}
            onClick={() => onSelect?.(c)}
            className={`${
              activeId === c._id
                ? "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-900"
                : "bg-transparent"
            } w-full text-left px-3 py-2 rounded-lg border border-transparent text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50`}
          >
            {c.title}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
