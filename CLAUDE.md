# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup        # Fresh install + Prisma generate + migrations (first-time setup)
npm run dev          # Start dev server on http://localhost:3000 (Turbopack)
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Run Vitest suite
npm run db:reset     # Force reset SQLite database
```

**Single test:** `npx vitest run src/lib/__tests__/<test-file>.test.ts`

**Environment:** Copy `.env` and set `ANTHROPIC_API_KEY` for real Claude. Without it, app runs with a static mock that returns hardcoded components.

## Architecture

UIGen is an AI-powered React component generator with live preview. Users describe components in chat; Claude generates code that populates a virtual file system, which is then transformed and rendered in a sandboxed iframe.

### Core Data Flow

1. User sends chat message → `/api/chat` (POST, streaming)
2. Vercel AI SDK's `streamText()` calls Claude with `str_replace_editor` and `file_manager` tools
3. AI tool calls modify the **VirtualFileSystem** (in-memory, no disk writes)
4. `FileSystemContext` propagates changes to all subscribers
5. `PreviewFrame` receives the updated VFS, runs JSX through Babel standalone + esm.sh import maps, renders in `<iframe>`

### Key Abstractions

**VirtualFileSystem** (`src/lib/file-system.ts`): In-memory file tree. Serializes to/from JSON for persistence in `Project.data` (Prisma). Auto-creates parent directories.

**AI Provider** (`src/lib/provider.ts`): Returns `claude-haiku-4-5` model when `ANTHROPIC_API_KEY` is set, otherwise `MockLanguageModel`. The mock generates one of three static components (counter, form, card).

**AI Tools** (`src/lib/tools/`):
- `str_replace_editor` — create, view, str_replace, insert in virtual files
- `file_manager` — rename/delete files and directories

**JSX Transformer** (`src/lib/transform/jsx-transformer.ts`): Babel standalone transforms JSX → JS client-side. Builds import maps pointing to esm.sh CDN for React and other deps. Handles Tailwind CSS compilation.

**Contexts** (`src/lib/contexts/`):
- `ChatContext` — holds conversation history, manages streaming state, calls `/api/chat`
- `FileSystemContext` — wraps VirtualFileSystem, exposes file CRUD to all components

### Authentication

JWT (HS256, 7-day expiry) in HTTP-only cookies. `JWT_SECRET` env var or falls back to `"development-secret-key"`. Server actions in `src/actions/` handle sign-up/sign-in (bcrypt passwords). Middleware at `src/middleware.ts` protects `/api/projects` and `/api/filesystem`. Anonymous users can work freely; on sign-in, `anon-work-tracker.ts` converts localStorage state to a persisted project.

### Database

Prisma with SQLite (`prisma/dev.db`). Two models: `User` (email/password) and `Project` (name, `messages` JSON, `data` JSON for VFS state, optional `userId`). Prisma client is a singleton in `src/lib/prisma.ts`.

### Layout

`src/app/main-content.tsx` renders three resizable panels side-by-side: **Chat** (left) | **Code Editor + File Tree** (center) | **Preview iframe** (right). The `[projectId]` route does a server-side auth check and redirects unauthenticated users.

### Path Alias

`@/*` maps to `./src/*` — use this for all internal imports.

### Node Compatibility

`NODE_OPTIONS='--require ./node-compat.cjs'` is prepended to build/dev scripts to polyfill Node.js built-ins for edge/browser runtime compatibility.
