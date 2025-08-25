const Welcome = ({ onNewChat }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        <div className="mx-auto mb-6 h-14 w-14 rounded-2xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300 flex items-center justify-center shadow-sm">
          {/* chat bubble icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
            <path d="M7.5 8.25a.75.75 0 1 1 0-1.5h9a.75.75 0 0 1 0 1.5h-9zm0 4.5a.75.75 0 1 1 0-1.5h5a.75.75 0 0 1 0 1.5h-5z" />
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 3.977-9.75 8.875 0 2.094.884 4.013 2.382 5.526-.23 1.16-.768 2.29-1.536 3.292a.75.75 0 0 0 .828 1.17c2.1-.54 3.713-1.47 4.81-2.412A11.9 11.9 0 0 0 12 20.125c5.385 0 9.75-3.977 9.75-8.875S17.385 2.25 12 2.25z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Welcome to your AI chat</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          You don't have any chats yet. Create a new conversation and start exploring with AI. It remembers short‑term context within your current chat and recalls long‑term, relevant details from your past conversations to deliver more helpful, personalized answers.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={onNewChat}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 text-white px-4 py-2 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75H19.5a.75.75 0 0 1 0 1.5h-6.75V19.5a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75z" clipRule="evenodd" />
            </svg>
            Create a new chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
