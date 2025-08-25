import React, { useEffect, useRef, useState } from "react";
import Logout from "../Logout";

const Sidebar = ({
  onNewChat,
  chats = [],
  activeId,
  onSelect,
  onRename,
  onDelete,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const [confirmState, setConfirmState] = useState({ open: false, chat: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  // Close the actions menu on outside click or Escape
  useEffect(() => {
    if (!openMenuId) return;
    const onDocPointer = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpenMenuId(null);
    };
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocPointer, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenuId]);

  // Close confirmation modal on Escape
  useEffect(() => {
    if (!confirmState.open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setConfirmState({ open: false, chat: null });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmState.open]);

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

  const Content = () => (
    <>
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
                  autoFocus
                  disabled={saving}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onBlur={() => commitEdit(c)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") commitEdit(c);
                    if (e.key === "Escape") cancelEdit();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-transparent outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            );
          }

          return (
            <div
              key={c._id}
              onClick={() => onSelect?.(c)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSelect?.(c);
              }}
              className={`${baseClass} group flex items-center justify-between gap-2 relative`}
              title="Open chat"
            >
              <span className="truncate pr-2">{c.title}</span>
              <div className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openMenuId === c._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId((prev) => (prev === c._id ? null : c._id));
                  }}
                  className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  title="More actions"
                >
                  {/* vertical ellipsis icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M12 6.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zm0 6a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zm0 6a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z" />
                  </svg>
                </button>
                {openMenuId === c._id && (
                  <div
                    ref={menuRef}
                    role="menu"
                    className="absolute right-0 top-full mt-1 z-50 w-40 rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-lg py-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      onClick={() => {
                        setOpenMenuId(null);
                        startEdit(c);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                      onClick={() => {
                        setOpenMenuId(null);
                        setConfirmState({ open: true, chat: c });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-200 dark:border-white/10">
        <Logout />
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
  <aside className="hidden md:flex md:flex-col w-64 h-full border-r border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40">
        <Content />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={onCloseMobile} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] h-full border-r border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-white/10">
              <div className="font-semibold text-slate-700 dark:text-slate-200">Chats</div>
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={onCloseMobile}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Content />
          </aside>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmState.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !deleting && setConfirmState({ open: false, chat: null })}
          />
          <div className="relative mx-4 w-full max-w-md rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-.75 6.75a.75.75 0 011.5 0v5.25a.75.75 0 01-1.5 0V9zm.75 8.25a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Delete chat?</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  This will permanently delete "{confirmState.chat?.title}" and all its messages. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setConfirmState({ open: false, chat: null })}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                disabled={deleting}
                onClick={async () => {
                  if (!confirmState.chat) return;
                  try {
                    setDeleting(true);
                    await onDelete?.(confirmState.chat._id);
                    setConfirmState({ open: false, chat: null });
                  } finally {
                    setDeleting(false);
                  }
                }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
