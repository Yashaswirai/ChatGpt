import React, { Suspense, lazy, useEffect, useState } from "react";
const ChatHeader = lazy(() => import("../components/chat/ChatHeader"));
const MessageList = lazy(() => import("../components/chat/MessageList"));
const Welcome = lazy(() => import("../components/chat/Welcome"));
const MessageInput = lazy(() => import("../components/chat/MessageInput"));
const Sidebar = lazy(() => import("../components/chat/Sidebar"));
import useSocket from "../hooks/useSocket";
import api from "../API";
import { toast } from "react-toastify";

// Contract
// - Outgoing: socket.emit('ai-message', { chatId, content })
// - Incoming: socket.on('ai-response', ({ chatId, response }))

const Home = () => {
  const { socket, connected } = useSocket();
  const [chatId, setChatId] = useState(null);
  const [title, setTitle] = useState("New Chat");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [pending, setPending] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load recent chats on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/chat");
        if (!mounted) return;
        const list = data?.chats ?? [];
        setChats(list);
        if (list.length > 0) {
          setChatId(list[0]._id);
          setTitle(list[0].title);
          // preload the latest message for the first chat
          try {
            const res = await api.get(`/chat/${list[0]._id}/messages`);
            const msgs = res?.data?.messages || [];
            if (msgs.length > 0) {
              setMessages(msgs.map(m => ({ role: m.role, content: m.content })));
            }
          } catch (e) {
            console.error(e);
          }
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load chats");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // listen for server responses
  useEffect(() => {
    const onAiResponse = ({ chatId: respChatId, response }) => {
      // ignore responses for other chats
      if (respChatId !== chatId) return;
      // append assistant message
      setMessages((prev) => [...prev, { role: "model", content: response }]);
      setPending(false);
    };
  const onDisconnect = () => setPending(false);
  const onError = () => setPending(false);
    socket.on("ai-response", onAiResponse);
  socket.on("disconnect", onDisconnect);
  socket.on("connect_error", onError);
    return () => socket.off("ai-response", onAiResponse);
  }, [socket, chatId]);

  const handleSend = (content) => {
    // optimistic user message
    setMessages((prev) => [...prev, { role: "user", content }]);
    setPending(true);
    if (!chatId) return toast.error("Chat not ready yet");
    socket.emit("ai-message", { chatId, content });
  };

  const handleNewChat = async () => {
    try {
      const { data } = await api.post("/chat", { title: "New Chat" });
      const chat = data?.chat;
      setChats((prev) => [chat, ...prev]);
      setChatId(chat?._id);
      setTitle(chat?.title || "New Chat");
      setMessages([]);
  setPending(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create chat");
    }
  };

  const handleSelectChat = async (c) => {
    setChatId(c._id);
    setTitle(c.title);
    setMessages([]);
  setPending(false);
  setMobileSidebarOpen(false);
    try {
      // Fetch full message history for this chat
      const { data } = await api.get(`/chat/${c._id}/messages`);
      const list = data?.messages || [];
      if (list.length > 0) {
        setMessages(list.map(m => ({ role: m.role, content: m.content })));
      }
    } catch (err) {
      // optional toast; keep UI quiet if none
      console.error(err);
    }
  };

  const handleRename = async (id, newTitle) => {
    try {
      const { data } = await api.put(`/chat/${id}`, { title: newTitle });
      const updated = data?.chat;
      // update list
      setChats((prev) => prev.map((c) => (c._id === id ? { ...c, title: updated?.title || newTitle } : c)));
      // if active chat, update header title too
      if (chatId === id) setTitle(updated?.title || newTitle);
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.response?.data?.message || "Failed to rename chat");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/chat/${id}`);
      setChats((prev) => prev.filter((c) => c._id !== id));
      // if deleting active chat, switch to next available
      if (chatId === id) {
        const remaining = chats.filter((c) => c._id !== id);
        const next = remaining[0];
        if (next) {
          setChatId(next._id);
          setTitle(next.title);
          setMessages([]);
          try {
            const { data } = await api.get(`/chat/${next._id}/messages`);
            const list = data?.messages || [];
            if (list.length > 0) setMessages(list.map((m) => ({ role: m.role, content: m.content })));
          } catch (e) {
            console.error(e);
          }
        } else {
          setChatId(null);
          setTitle("New Chat");
          setMessages([]);
        }
      }
      setMobileSidebarOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.response?.data?.message || "Failed to delete chat");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center p-0 transition-colors">
      <div className="w-full max-w-6xl h-screen md:h-[90vh] md:my-4 rounded-none md:rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-black/30 flex">
        <Suspense fallback={<div className="w-64 h-full flex items-center justify-center"><div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-sky-500 animate-spin" /></div>}>
          <Sidebar
            onNewChat={handleNewChat}
            chats={chats}
            activeId={chatId}
            onSelect={handleSelectChat}
            onRename={handleRename}
            onDelete={handleDelete}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        </Suspense>
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Suspense fallback={<div className="h-14 flex items-center justify-center border-b border-slate-200 dark:border-white/10"><div className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-sky-500 animate-spin" /></div>}>
            <ChatHeader
              title={title}
              onToggleSidebar={() => setMobileSidebarOpen((v) => !v)}
              sidebarOpen={mobileSidebarOpen}
            />
          </Suspense>
          <Suspense fallback={<div className="flex-1 min-h-0 flex items-center justify-center"><div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-sky-500 animate-spin" /></div>}>
            {chats.length === 0 || !chatId ? (
              <Welcome onNewChat={handleNewChat} />
            ) : (
              <>
                <MessageList messages={messages} pending={pending} />
                <MessageInput
                  onSend={handleSend}
                  disabled={!connected || pending || !chatId}
                />
              </>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Home;
