import React, { useState } from "react";

const MessageInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = value.trim();
    if (!content) return;
    onSend(content);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex items-center gap-2"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Send a message…"
        className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-white/10 px-4 py-3 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      />
      <button
        disabled={disabled}
        className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
