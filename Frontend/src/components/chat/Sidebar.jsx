import React, { useEffect, useRef, useState } from "react";

const Sidebar = ({ onNewChat, chats = [], activeId, onSelect, onRename }) => {
  const [editingId, setEditingId] = useState(null);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startEdit = (chat) => {
    setEditingId(chat._id);
    setValue(chat.title || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setValue("");
    setSaving(false);
  };

  const commitEdit = async (chat) => {
    const newTitle = (value || "").trim();
    if (!newTitle || newTitle === chat.title) return cancelEdit();
    try {
      setSaving(true);
      await onRename?.(chat._id, newTitle);
      cancelEdit();
  } catch {
      // parent shows toast; just exit edit mode on failure or keep? keep to allow retry
      setSaving(false);
    }
  };

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
        {chats.map((c) => {
          const isActive = activeId === c._id;
          const baseClass = `${
            isActive
              ? "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-900"
              : "bg-transparent"
          } w-full text-left px-3 py-2 rounded-lg border border-transparent text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50`;

          if (editingId === c._id) {
            return (
              <div key={c._id} className={baseClass}>
                <input
                  ref={inputRef}
                  disabled={saving}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onBlur={() => commitEdit(c)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEdit(c);
                    if (e.key === "Escape") cancelEdit();
                  }}
                  className="w-full bg-transparent outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            );
          }

          return (
            <button
              key={c._id}
              onClick={() => onSelect?.(c)}
              onDoubleClick={(e) => {
                e.preventDefault();
                startEdit(c);
              }}
              className={baseClass}
              title="Double-click to rename"
            >
              {c.title}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
