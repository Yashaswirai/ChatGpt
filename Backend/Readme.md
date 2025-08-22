# ChatGpt — Real-time AI Chat Backend ✨🤖

Summary 🧭
- Purpose: Node.js backend for an AI chat app with user auth, chat threads, real-time replies via Socket.IO, and long-term memory using Pinecone. ✍️
- Status: MVP in progress. 🚦
- Owner(s): Yashaswirai. 👤
- Live URLs: Not deployed yet. 🔗
- Repo: Monorepo not used; this is a single service. 🗂️

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
- Solution: Express + MongoDB API, Socket.IO for real-time chat, Google GenAI for text generation and embeddings, Pinecone for vector memory (RAG-style retrieval). 🧩
- Non-goals: Frontend/UI, multi-provider abstraction, role-based admin panel. 🚫

## Features ✨
Current
- JWT auth with cookies (register/login). 🌟
- Chat thread creation and message persistence. 🌟
- Real-time AI replies over WebSocket events. 🌟
- Long-term memory via Pinecone with embeddings from Google GenAI. 🌟

Planned
- Streaming token responses. 🗓️
- Message and chat management REST endpoints. 🗓️
- Rate limiting and input validation. 🗓️

## Architecture 🏗️
High-level
- Backend/API: Express 5 on Node.js; Socket.IO for realtime. 🧱
- AI Provider: Google GenAI
  - Text model: `gemini-2.5-flash`
  - Embedding model: `gemini-embedding-001`
- Data: MongoDB (Mongoose) for users/chats/messages; Pinecone index `chatgpt` for vectors (dim 768). 🗄️
- Auth: JWT, stored in `token` cookie for HTTP and Socket.IO handshake. 🔐
- Observability: Console logging. 📊

Data flow 🔄
1) Client emits `ai-message` with `{ chatId, content }`.
2) Server saves the user message and embeds it; upserts into Pinecone. 
3) Server fetches top-k related memories and recent chat history.
4) Prompt is built from long-term memory (LTM) + short-term history (STM).
5) Google GenAI generates the response; server emits `ai-response` and persists it; embedding stored to Pinecone.

Key decisions 🧠
- Google GenAI for cost/speed; Pinecone for scalable vector memory.
- Fixed topK memory retrieval; last 7 messages for STM.

## Project Layout 🗂️
```
package.json
Readme.md
server.js
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
- Node.js LTS (18+ recommended) and npm
- MongoDB database (Atlas/local)
- Pinecone account with index `chatgpt` (dimension 768)
- Google API key for Generative AI

Install dependencies 📦
- Windows PowerShell:
  - npm install

Environment 🌱
- Create a `.env` file in repo root:
  - PORT=3000
  - MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"
  - JWT_SECRET="your_jwt_secret"
  - GOOGLE_API_KEY="your_google_genai_api_key"
  - PINECONE_API_KEY="your_pinecone_api_key"

Start dev ▶️
- npm run dev
- Server listens on `http://localhost:<PORT>` (default 3000)

## Configuration 🔧
Environment variables 🔑
- PORT: HTTP port (default 3000)
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: Secret to sign/verify JWTs
- GOOGLE_API_KEY: Google Generative AI API key (used by `@google/genai`)
- PINECONE_API_KEY: Pinecone API key (index name `chatgpt`)

Notes
- Ensure Pinecone index `chatgpt` exists with dimension 768.
- Cookie name is `token`; set `withCredentials` on frontend requests/sockets if cross-origin.

## Usage ▶️
HTTP base URL
- `/` GET → Health/info: returns "Welcome to the MERN-GPT API".

Auth flow (cookies)
1) POST `/api/auth/register` → sets `token` cookie
2) POST `/api/auth/login` → sets `token` cookie
3) Use cookie-authenticated requests and socket connections

Create a chat
- POST `/api/chat` (auth) with `{ "title": "My Chat" }` → returns new chat

## API 🔌
Conventions
- JSON; cookie-based JWT; status codes on failures.

Endpoints 📡
- POST `/api/auth/register`
  - Body: `{ username, email, password }`
  - 201, sets `token` cookie; returns `newUser`
- POST `/api/auth/login`
  - Body: `{ identifier, password }` (identifier = username or email)
  - 200, sets `token` cookie; returns `user`
- POST `/api/chat` (auth required)
  - Body: `{ title }`
  - 201; returns `{ chat }`

Errors 🧯
- 400 duplicate user, 401 unauthorized, 404 user not found, 500 server errors

## Sockets 🔌⚡
Namespace: default
- Auth: via `token` cookie parsed during Socket.IO handshake.

Events
- Client → Server: `ai-message`
  - Payload: `{ chatId: string, content: string }`
- Server → Client: `ai-response`
  - Payload: `{ chatId: string, response: string }`

Flow
1) Server stores the user message (MongoDB) and upserts its embedding (Pinecone).
2) Retrieves top-K related memories and last 7 chat messages.
3) Builds prompt (LTM + STM), calls Google GenAI, emits `ai-response`.
4) Persists model response and its embedding.

## Data Model 🗃️
User
- username (unique, required)
- email (unique, required)
- password (hash)

Chat
- userId (ref User, required)
- title (required)

Message
- chatId (ref Chat, required)
- sender (ref User, required)
- content (string, required)
- role ("user" | "model" | "system")

## Prompting & AI Integration 🤖🧠
System/Context
- Long-term memory injected as a system-style message with concatenated previous contents from Pinecone matches.

Message formatting
- Google GenAI `contents`: each message as `{ role, parts: [{ text }] }`.
- STM: last 7 messages; LTM: memory from Pinecone.

Models
- Text: `gemini-2.5-flash`
- Embedding: `gemini-embedding-001` with outputDimensionality 768

## Quality (Testing, Linting) ✅
- No tests or linters configured yet.
- Suggested next: add ESLint + basic unit tests for controllers and middleware.

## Build & Deploy 🚢
- Node service, no build step required.
- Provide `.env` at runtime and reachable MongoDB and Pinecone.
- Ensure HTTPS and secure cookies in production.

## Security & Compliance 🔐
- JWT stored in cookie `token`.
- Recommendations: set HttpOnly, Secure, SameSite; rotate `JWT_SECRET`; validate inputs.

## Observability 👀
- Basic console logs. Consider adding request logging and error tracking.

## Performance & Cost ⚡
- Embedding dimension 768; topK default 2 for memory queries.
- Consider batching embeddings and caching frequent prompts.

## Roadmap 🗺️
- [ ] Streaming responses over Socket.IO
- [ ] REST endpoints for messages and chat listing
- [ ] Rate limiting and input validation
- [ ] Add tests and linting

## Changelog 📝
- 2025-08-21: Initial complete README based on current code.

## License 📄
- TBD

## FAQ & Troubleshooting ❓💡
- MongoDB connection error: verify `MONGODB_URI` and network access.
- Unauthorized/401: ensure `token` cookie is present; set `JWT_SECRET` and re-login.
- Pinecone errors: ensure `PINECONE_API_KEY` and index `chatgpt` (dim 768) exist.
- No AI response: check `GOOGLE_API_KEY` and model availability.
