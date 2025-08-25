# ChatGpt — Real‑time AI Chat Backend ✨🤖

Summary 🧭
- Purpose: Node.js backend for an AI chat app with user auth, chat threads, real‑time replies via Socket.IO, and long‑term memory using Pinecone. ✍️
- Status: MVP working for local dev and demo. 🚦
- Owner(s): Yashaswirai. 👤
- Live URL (demo): https://chatgpt-sc2z.onrender.com (API base at `/api`, Socket at root). 🔗
- Repo: Monorepo with `Backend/` and `Frontend/`. 🗂️

## Table of Contents 📚
- Overview 🚀
- Features ✨
- Architecture 🏗️
- Project Layout 🗂️
- Setup ⚙️
- Configuration 🔧
- Usage ▶️
- API 🔌
- Sockets 🔌⚡
- Data Model 🗃️
- Prompting & AI Integration 🤖🧠
- Quality (Testing, Linting) ✅
- Build & Deploy 🚢
- Security & Compliance 🔐
- Observability 👀
- Performance & Cost ⚡
- Roadmap 🗺️
- Changelog 📝
- License 📄
- FAQ & Troubleshooting ❓💡

## Overview 🚀
- Problem: Provide a backend that can authenticate users, organize chats, generate AI responses, and retain context across sessions. 🎯
- Solution: Express + MongoDB API, Socket.IO for real‑time chat, Google GenAI for text generation and embeddings, Pinecone for vector memory (RAG‑style retrieval). 🧩
- Non‑goals: Admin UI, provider abstraction, multi‑tenant RBAC. 🚫

## Features ✨
Current
- 🔐 JWT auth with cookies (register/login/status/logout).
- 🧵 Chat thread CRUD (create, read, update title, delete).
- 💾 Message persistence and retrieval per chat.
- ⚡ Real‑time AI replies over WebSockets.
- 🧠 Long‑term memory via Pinecone using Google GenAI embeddings.

Planned
- 🗳️ Streaming token responses.
- 🛡️ Rate limiting and input validation.
- 🧪 Basic tests and linting.

## Architecture 🏗️
- Backend/API: Express 5 on Node.js; Socket.IO for realtime. 🧱
- AI Provider: Google GenAI
  - Text model: `gemini-2.5-flash`
  - Embedding model: `gemini-embedding-001`
- Data: MongoDB (Mongoose) for users/chats/messages; Pinecone index `chatgpt` for vectors (dim 768). 🗄️
- Auth: JWT via `token` cookie for HTTP and Socket.IO handshake. 🔐
- Observability: Console logging. 📊

Data flow 🔄
1) Client emits `ai-message` with `{ chatId, content }`.
2) Server saves the user message, creates an embedding, and upserts to Pinecone.
3) Server fetches top‑K related memories and recent chat history.
4) Builds prompt from LTM + STM and calls Google GenAI.
5) Emits `ai-response` and persists the model reply and its embedding.

## Project Layout 🗂️
```
Backend/
  package.json
  Readme.md
  server.js
  public/
    index.html
    assets/*
  src/
    app.js
    controllers/
      auth.controller.js
      chat.controller.js
    db/
      db.js
    middlewares/
      auth.middleware.js
    models/
      chat.model.js
      message.model.js
      user.model.js
    routes/
      auth.routes.js
      chat.routes.js
    services/
      Ai.service.js
      Vector.service.js
    socket/
      socket.server.js
```

## Setup ⚙️
Prerequisites 🧰
- Node.js LTS (18+) and npm
- MongoDB database (Atlas/local)
- Pinecone account with index `chatgpt` (dimension 768)
- Google Generative AI API key

Install dependencies 📦 (Windows PowerShell)
```powershell
cd Backend
npm install
```

Environment 🌱
Create `Backend/.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/MERN-GPT
JWT_SECRET=replace_with_a_long_random_string
GOOGLE_API_KEY=your_google_genai_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

Start dev ▶️
```powershell
cd Backend
npm run dev
```
- Server: http://localhost:3000
- CORS (HTTP & Socket.IO) default origin: `http://localhost:5173` with credentials

## Configuration 🔧
Environment variables 🔑
- `PORT`: HTTP port (default 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret to sign/verify JWTs
- `GOOGLE_API_KEY`: Google Generative AI API key (used by `@google/genai`)
- `PINECONE_API_KEY`: Pinecone API key (index name `chatgpt`)

Notes
- Ensure Pinecone index `chatgpt` exists with dimension 768.
- Cookie name is `token`; frontend must set `withCredentials: true` on axios and Socket.IO.
- Update CORS origins in `src/app.js` and `src/socket/socket.server.js` for production.

## Usage ▶️
Auth flow (cookies)
1) `POST /api/auth/register` → sets `token` cookie
2) `POST /api/auth/login` → sets `token` cookie
3) `GET /api/auth/status` → verifies session
4) `GET /api/auth/logout` → clears `token`

Chats
- `POST /api/chat` (auth) with `{ "title": "My Chat" }` → returns new chat
- Use `GET /api/chat/:id/messages` to fetch conversation
- Use Socket.IO to send messages and receive AI responses

## API 🔌
Conventions
- JSON; cookie‑based JWT; standard status codes on failures.

Auth
- `POST /api/auth/register`
  - Body: `{ username, email, password }`
  - 201; sets cookie `token`; returns `{ message, newUser }`
- `POST /api/auth/login`
  - Body: `{ identifier, password }` (identifier = username or email)
  - 200; sets cookie `token`; returns `{ message, user }`
- `GET /api/auth/status` → `{ isAuthenticated, user? }`
- `GET /api/auth/logout` → `{ message }`

Chats
- `GET /api/chat` (auth) → `{ chats }` (sorted by `updatedAt` desc)
- `POST /api/chat` (auth) → `{ message, chat }`
- `GET /api/chat/:id` (auth) → `{ chat }`
- `PUT /api/chat/:id` (auth) body `{ title }` → `{ message, chat }`
- `DELETE /api/chat/:id` (auth) → `{ message }` and deletes associated messages + vectors
- `GET /api/chat/:id/messages` (auth) → `{ messages }` (ascending by `createdAt`)
- `GET /api/chat/prompts` (auth) → `{ prompts }` (onboarding suggestions)

Errors 🧯
- 400 duplicate user, 401 unauthorized, 404 not found, 500 server errors

## Sockets 🔌⚡
Namespace: default
- Auth: via `token` cookie parsed during Socket.IO handshake.

Events
- Client → Server: `ai-message`
  - Payload: `{ chatId: string, content: string }`
- Server → Client: `ai-response`
  - Payload: `{ chatId: string, response: string }`

Flow
1) Persist user message (MongoDB) and embed → upsert to Pinecone.
2) Retrieve top‑K memory (LTM) and last 7 messages (STM).
3) Compose prompt and call Google GenAI.
4) Emit `ai-response`, persist model reply, embed + store in Pinecone.

## Data Model 🗃️
User
- `username` (unique, required)
- `email` (unique, required)
- `password` (hash)

Chat
- `userId` (ref User, required)
- `title` (required)

Message
- `chatId` (ref Chat, required)
- `sender` (ref User, required)
- `content` (string, required)
- `role` ("user" | "model" | "system")

## Prompting & AI Integration 🤖🧠
- Models: `gemini-2.5-flash` (text), `gemini-embedding-001` (embeddings, 768 dims)
- LTM injected as a system‑style message with concatenated Pinecone match contents
- STM built from the last 7 chat messages
- Request format uses Google GenAI `contents` array with `{ role, parts: [{ text }] }`

## Quality (Testing, Linting) ✅
- No tests or linters configured yet.
- Suggested: add ESLint + unit tests for controllers/middleware.

## Build & Deploy 🚢
- Node service (no build step for backend). Run with `node server.js` in production.
- Provide required env vars and ensure MongoDB/Pinecone/Google access.
- Set proper CORS origins and secure cookie options in production.

## Security & Compliance 🔐
- JWT stored in cookie `token`.
- Recommendations: set `HttpOnly`, `Secure`, `SameSite` on cookies; rotate `JWT_SECRET`; validate inputs; rate limit auth and chat endpoints.

## Observability 👀
- Console logs only. Consider adding request logging (morgan) and error tracking (Sentry, etc.).

## Performance & Cost ⚡
- Embedding 768 dims; topK default 2 for memory queries.
- Consider caching frequent prompts and batching embeddings.

## Roadmap 🗺️
- [ ] Streaming responses over Socket.IO
- [ ] Rate limiting and input validation
- [ ] Add tests and linting

## Changelog 📝
- 2025‑08‑25: Updated README to reflect actual endpoints, env location, and live URL.

## License 📄
- TBD

## FAQ & Troubleshooting ❓💡
- MongoDB connection error: verify `MONGODB_URI` and network access.
- Unauthorized/401: ensure `token` cookie is present; set `JWT_SECRET` and re‑login.
- Pinecone errors: ensure `PINECONE_API_KEY` and index `chatgpt` (dim 768) exist.
- No AI response: check `GOOGLE_API_KEY` and model availability.
- CORS issues in prod: update allowed origins in `src/app.js` and `src/socket/socket.server.js` to your frontend domain.
