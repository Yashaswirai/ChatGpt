# ChatGpt — Full‑Stack AI Chat App 🤖⚡

A complete chat experience with authentication, real‑time AI replies, long‑term memory, and a modern React UI. The project is split into two apps:

- Backend: Node.js + Express + MongoDB + Socket.IO + Google GenAI + Pinecone
- Frontend: React (Vite) + React Router + Tailwind + Socket.IO Client


## ✅ What you’ll get
- 🔐 Cookie‑based auth (register, login, logout)
- 💬 Chat threads with message history
- ⚡ Real‑time AI responses via WebSockets
- 🧠 Long‑term memory using embeddings (Pinecone)
- 🧾 REST API for auth, chats, messages, and prompts
- 🖥️ Clean React UI with markdown rendering and toasts


## 🗂️ Monorepo layout
```
Backend/
  server.js
  src/
    app.js
    controllers/
    db/
    middlewares/
    models/
    routes/
    services/
    socket/
Frontend/
  src/
    components/
    hooks/
    pages/
    routes/
  vite.config.js
```


## 🧰 Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Pinecone account + index named `chatgpt` (dimension 768)
- Google Generative AI API key


## 🚀 Quick start (Windows PowerShell)

1) Install dependencies
```powershell
# From repo root
cd Backend; npm install; cd ..
cd Frontend; npm install; cd ..
```

2) Configure environment variables

- Backend: create `Backend/.env`
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/MERN-GPT
JWT_SECRET=replace_with_a_long_random_string
GOOGLE_API_KEY=your_google_genai_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

- Frontend: the current code points to a deployed backend. For local dev, either:
  - Edit `Frontend/src/API.js` and `Frontend/src/hooks/useSocket.js` to use `http://localhost:3000`, or
  - Introduce Vite envs (recommended) and update the code to read from `import.meta.env`:
    - `Frontend/.env.development`
      ```
      VITE_API_BASE_URL=http://localhost:3000/api
      VITE_SOCKET_URL=http://localhost:3000
      ```

3) Run both apps
```powershell
# Terminal 1
cd Backend; npm run dev

# Terminal 2
cd Frontend; npm run dev
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173


## 🔧 Configuration notes
- CORS is configured to allow `http://localhost:5173` with credentials (cookies).
- Auth uses a `token` cookie; keep `withCredentials: true` on Axios and Socket.IO.
- Ensure your Pinecone index exists: name `chatgpt`, dimension `768`.


## 📡 REST API
Base URL
- Local: `http://localhost:3000/api`
- Production (current Frontend defaults): `https://chatgpt-sc2z.onrender.com/api`

Auth
- POST `/auth/register`
  - Body: `{ "username": string, "email": string, "password": string }`
  - Sets `token` cookie; returns `{ message, newUser }`
- POST `/auth/login`
  - Body: `{ "identifier": string, "password": string }` (identifier = username or email)
  - Sets `token` cookie; returns `{ message, user }`
- GET `/auth/status`
  - Returns `{ isAuthenticated: boolean, user? }`
- GET `/auth/logout`
  - Clears `token` cookie

Chats
- GET `/chat` (auth)
  - Returns `{ chats }` (current user’s chats)
- POST `/chat` (auth)
  - Body: `{ "title": string }`
  - Returns `{ message, chat }`
- GET `/chat/:id` (auth)
  - Returns `{ chat }`
- PUT `/chat/:id` (auth)
  - Body: `{ "title": string }`
  - Returns `{ message, chat }`
- DELETE `/chat/:id` (auth)
  - Returns `{ message }`
- GET `/chat/:id/messages` (auth)
  - Returns `{ messages }` (ascending by time)
- GET `/chat/prompts` (auth)
  - Returns `{ prompts }` (onboarding suggestions)

Errors
- 400 duplicate user; 401 unauthorized; 404 not found; 500 server errors


## 🔌 WebSockets (Socket.IO)
Connection
- Local: `http://localhost:3000`
- Production (current Frontend defaults): `https://chatgpt-sc2z.onrender.com`
- Auth: via `token` cookie read in the Socket.IO handshake

Events
- Client → Server: `ai-message`
  - Payload: `{ chatId: string, content: string }`
- Server → Client: `ai-response`
  - Payload: `{ chatId: string, response: string }`

Flow
1) Save user message → embed → upsert to Pinecone
2) Fetch top‑K similar memories + last 7 chat messages
3) Build prompt (LTM + STM) → call Google GenAI
4) Emit `ai-response`, persist model reply, embed + store to Pinecone


## 🗃️ Data models (MongoDB)
User
- `username` (unique, required)
- `email` (unique, required)
- `password` (hashed)

Chat
- `userId` (ref User, required)
- `title` (required)

Message
- `chatId` (ref Chat, required)
- `sender` (ref User, required)
- `content` (string, required)
- `role` ("user" | "model" | "system")


## 🧠 AI & Memory
- Text model: `gemini-2.5-flash`
- Embeddings: `gemini-embedding-001` with `outputDimensionality: 768`
- Vector store: Pinecone index `chatgpt`
- Prompt: LTM (retrieved matches) + STM (last 7 messages), formatted as Google GenAI `contents`


## 🖥️ Frontend highlights
- React 19 + Vite + Tailwind
- Routing with React Router
- Markdown rendering via `react-markdown`
- Toasts via `react-toastify`
- Socket hook for real‑time updates


## 🚢 Deployment tips
- Backend: provide `.env` at runtime, enable HTTPS, set secure cookies (HttpOnly, Secure, SameSite=Strict/Lax)
- CORS: set your production frontend origin
- Pinecone/Google keys: keep them server‑side only


## 🧪 Quality and security
- Input validation and rate limiting are recommended next steps
- Add ESLint/Prettier and unit tests for controllers/middleware


## ❓ Troubleshooting
- 401 Unauthorized: ensure `token` cookie is set; re‑login; verify `JWT_SECRET`
- CORS errors: confirm frontend origin matches backend CORS config and `withCredentials` is set
- Pinecone errors: verify API key and index (`chatgpt`, dim 768)
- No AI reply: check `GOOGLE_API_KEY` and model availability; inspect server logs
- Cookies in dev: avoid opening the frontend via `file://`; use `http://localhost:5173`


## 🗺️ Roadmap
- [ ] Streaming responses over Socket.IO
- [ ] Message CRUD via REST
- [ ] Rate limiting and input validation
- [ ] Tests and linting


## 📄 License
Specify your license here (e.g., MIT).

---

Made with care to be friendly and productive ✨