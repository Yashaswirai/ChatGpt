import React from "react";

const ChatHeader = ({ title = "New Chat", onToggleSidebar, sidebarOpen = false }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
      <div className="flex items-center gap-3 select-none">
        {/* Mobile-only: sidebar toggle */}
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={() => onToggleSidebar?.()}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
       >
          {sidebarOpen ? (
            // X icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
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
