# Frontend — ChatGpt UI (React + Vite) 🖥️⚡

A modern React UI for the ChatGpt backend with authentication, real‑time chat, and a clean, responsive interface.


## ✨ Features
- 🔐 Auth pages: Register, Login (cookie‑based)
- 💬 Chat interface with message bubbles, sidebar, and welcome screen
- ⚡ Real‑time replies via Socket.IO
- 📝 Markdown rendering for AI responses (`react-markdown`)
- 🔔 Toast notifications (`react-toastify`)
- 🎞️ Nice loaders/animations (Lottie)
- 🎨 Tailwind CSS styling


## 🧱 Tech stack
- React 19 + Vite 7
- React Router 7
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- Axios, Socket.IO Client
- ESLint (recommended rules)

See `package.json` for exact versions.


## 🚀 Quick start (Windows PowerShell)

The frontend is already configured to talk to a deployed backend (no local backend needed to try the UI).

```powershell
# From repo root
cd Frontend
npm install
npm run dev
```

Open: http://localhost:5173


## 🔧 Configuration
This app needs two backend URLs:
- API base URL (for HTTP/axios)
- Socket URL (for Socket.IO)

Current defaults in code (production demo):
- `src/API.js` → `https://chatgpt-sc2z.onrender.com/api`
- `src/hooks/useSocket.js` → `https://chatgpt-sc2z.onrender.com`

For local development with a local backend, you can either:

1) Hardcode localhost
- Edit `src/API.js` to: `http://localhost:3000/api`
- Edit `src/hooks/useSocket.js` to: `http://localhost:3000`

2) Use Vite env variables (recommended)
- Create `Frontend/.env.development`:
  ```
  VITE_API_BASE_URL=http://localhost:3000/api
  VITE_SOCKET_URL=http://localhost:3000
  ```
- Then update `src/API.js` and `src/hooks/useSocket.js` to read from `import.meta.env`:
  - `import.meta.env.VITE_API_BASE_URL`
  - `import.meta.env.VITE_SOCKET_URL`

Remember to keep `withCredentials: true` on axios and Socket.IO for cookie auth.


## 📂 Project structure
```
Frontend/
  src/
    API.js              # Axios instance (with credentials)
    App.jsx             # App shell
    main.jsx            # Entry
    index.css           # Tailwind styles
    components/         # UI components
      Loader.jsx
      Logout.jsx
      chat/
        ChatHeader.jsx
        MessageBubble.jsx
        MessageInput.jsx
        MessageList.jsx
        Sidebar.jsx
        TypingBubble.jsx
        Welcome.jsx
    hooks/
      useAuth.js        # GET /auth/status (cookie auth)
      useSocket.js      # Socket.IO client (with credentials)
    pages/
      Home.jsx
      Login.jsx
      Register.jsx
    routes/
      AuthRoute.jsx     # Guards auth-only routes
      IndexRoute.jsx    # Routes config
  vite.config.js        # Vite + Tailwind plugin
```


## 📜 Available scripts
```powershell
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview the production build
npm run lint      # Lint the codebase
```


## 🔐 Auth flow (frontend)
- On login/register, the backend sets a `token` cookie (HttpOnly on the server side).
- Axios is configured with `withCredentials: true`, so cookies are sent automatically.
- `useAuth()` calls `/auth/status` to verify the session and gate routes.


## 🔌 Realtime (Socket.IO)
- `useSocket()` creates a Socket.IO client with `withCredentials: true`.
- The cookie is read by the backend during the Socket.IO handshake.
- Incoming server event: `ai-response` → updates the UI.
- Outgoing client event: `ai-message` → `{ chatId, content }`.


## 📝 Styling
- Tailwind CSS is enabled via the official Vite plugin.
- Global styles live in `src/index.css`.


## 🧪 Tips for development
- Keep the browser open at `http://localhost:5173` (not `file://`) so cookies and CORS behave correctly.
- If you change Vite env files, restart the dev server.
- To test with a local backend, ensure the backend allows CORS for `http://localhost:5173` and credentials.


## 🧯 Troubleshooting
- CORS errors: Make sure backend `origin` matches the frontend URL and `credentials: true` is enabled. Keep `withCredentials: true` in axios/socket.
- 401 Unauthorized: Log in again to refresh the cookie. Verify backend `JWT_SECRET` and cookie settings.
- Socket not connecting: Check `VITE_SOCKET_URL` or the hardcoded URL and that the backend is reachable over HTTP/HTTPS.
- White screen: Check console for errors from missing env vars or wrong URLs.


## 📄 License
Add your license of choice (e.g., MIT).

---

Built with React and a touch of ✨ to make chatting smooth and fun.
