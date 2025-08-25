import Markdown from "react-markdown";

const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";

  // Shared bubble classes to keep look consistent with the screenshot
  const bubbleBase =
    "max-w-[75%] min-w-0 break-words rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap shadow-md overflow-hidden";
  const bubbleTone = isUser
    ? "bg-sky-600 text-white rounded-br-sm"
    : "bg-white dark:bg-slate-800/70 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-bl-sm";

  // Minimal markdown component overrides to avoid extra spacing and keep the bubble tight
  const components = {
    p: ({ children }) => <p className="m-0 leading-relaxed">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noreferrer" className="underline">
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>
    ),
    li: ({ children }) => <li className="m-0">{children}</li>,
    // Inline and block code styling to match the compact, readable look
    code({ inline, className = "", children, ...props }) {
      if (inline) {
        return (
          <code
            className={`rounded px-1 py-[1px] text-[0.85em] ${
              isUser
                ? "bg-sky-700/50 text-white"
                : "bg-black/10 dark:bg-white/10"
            }`}
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code className={`text-[0.85rem] ${className}`} {...props}>
          {children}
        </code>
      );
    },
  pre: ({ children }) => (
      <pre
    className={`mt-2 mb-0 overflow-x-auto rounded-xl p-3 max-w-full w-full ${
          isUser ? "bg-sky-700/80 text-white" : "bg-slate-900/90 text-slate-100"
        }`}
      >
        {children}
      </pre>
    ),
    h1: ({ children }) => (
      <h1 className="m-0 text-base font-semibold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="m-0 text-base font-semibold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="m-0 text-base font-semibold">{children}</h3>
    ),
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`${bubbleBase} ${bubbleTone}`}>
        <Markdown components={components}>{content}</Markdown>
      </div>
    </div>
  );
};

export default MessageBubble;
