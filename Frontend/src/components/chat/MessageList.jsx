import React, { useEffect, useRef, useState, useMemo } from "react";
import api from "../../API";
import MessageBubble from "./MessageBubble";
import TypingBubble from "./TypingBubble";

const MessageList = ({ messages, pending }) => {
  // Creative prompts to show when the conversation is empty
  const localFallback = useMemo(
    () => [
      "Ask me anything — code, writing, ideas.",
      "Tip: Paste an error and I’ll help debug it.",
      "Try: ‘Explain async/await in simple terms.’",
      "Need structure? Ask me to outline a plan.",
      "Turn rough notes into a polished message.",
      "Brainstorm features, test cases, or titles.",
    ],
    []
  );
  const [prompts, setPrompts] = useState(localFallback);
  const [promptIndex, setPromptIndex] = useState(() =>
    Math.floor(Math.random() * prompts.length)
  );
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  // Fetch prompts once
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await api.get("/chat/prompts");
        const list = Array.isArray(data?.prompts) ? data.prompts : null;
        if (isMounted && list && list.length) {
          setPrompts(list);
          setPromptIndex(Math.floor(Math.random() * list.length));
        }
  } catch {
        // Ignore errors and keep fallback
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Rotate prompts while the list is empty
  useEffect(() => {
    if (messages.length > 0) return;
    const id = setInterval(() => {
      setPromptIndex((i) => (i + 1) % prompts.length);
    }, 4000);
    return () => clearInterval(id);
  }, [messages.length, prompts.length]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/40">
      {messages.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center text-slate-500 dark:text-slate-400">
          {prompts[promptIndex]}
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
