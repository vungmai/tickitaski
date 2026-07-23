# TickiTaski

AI-powered IELTS Writing Task 1 practice app. Upload a chart/graph/map/process diagram,
get AI strategy hints and a sample answer, write your essay, and receive instant rubric-based
band scoring and feedback.

## Stack

- React (Vite) + Chakra UI
- Zustand for state
- React Router v6
- Firebase (Auth, Firestore, Storage)
- Anthropic API (Claude 3.5 Sonnet) for vision analysis and essay evaluation

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Firebase + Anthropic credentials
npm run dev
```

> **Security note:** the Anthropic client currently runs with `dangerouslyAllowBrowser: true`,
> which calls Claude directly from the browser and exposes the API key client-side. This is
> fine for local development only — before deploying, move those calls behind a backend or
> Firebase Cloud Function.

## Project structure

- `src/config/` — Firebase and Anthropic client setup
- `src/store/` — Zustand stores (`useAuthStore`, `useWorkspaceStore`, `useHistoryStore`)
- `src/services/` — Firebase/Anthropic API calls (auth, storage, Firestore, AI)
- `src/components/` — shared UI (Navbar, ImageUploader, TaskWorkspace, EvaluationReport, ...)
- `src/pages/` — routed pages (AuthPage, WorkspacePage, HistoryPage)
