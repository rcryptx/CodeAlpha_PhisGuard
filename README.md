# PhisGuard

PhisGuard is a phishing-awareness and cybersecurity education platform built to help users pause, inspect, and verify before they click. The app provides learning, local URL inspection, simulation-driven practice, assessments, progress tracking, curated resources, and an optional Gemini-powered ZYNX assistant.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Vitest + Testing Library
- Node.js built-in HTTP server for the server-side ZYNX API

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the development server
- `npm run dev:server` — compile and start the local ZYNX API server
- `npm run build` — run frontend/backend TypeScript checks and produce a production build
- `npm run lint` — run static analysis
- `npm run test` — run frontend and backend test suites
- `npm run format` — format the source files with Prettier

## Architecture notes

The app follows a modular structure with route boundaries for:

- Home
- Learn
- URL Inspector
- Practice Lab
- Flashcards
- Assessments
- Progress
- Resources
- ZYNX

The Learning Centre, local URL Inspector, Practice Lab, curriculum-aligned Assessments, lesson progress tracking, and curated Resources directory are functional. The ZYNX assistant works when its server-side Gemini configuration is present. Flashcards remain under development.

## Local learning progress

Lesson completion is explicit: opening a lesson does not mark it complete. Learners can mark a lesson complete or reopen it from the lesson page. Completion records are stored in the browser's `localStorage` under the versioned `phisguard.learning-progress` key and validated against current curriculum slugs when read. The Progress page derives completion counts, percentage, and recent activity from those records. Clearing browser data removes the saved progress; there is no account, cloud sync, or permanent assessment-result storage.

## Learning resources

The Resources directory is a structured catalogue in `src/features/resources/resourceData.ts`. It combines a small set of existing PhisGuard lessons with external guidance from CISA and the UK NCSC. External links are attributed, opened separately, and validated as HTTPS URLs; related lesson links use current curriculum slugs.

## ZYNX and Gemini setup

ZYNX is an optional educational assistant. The React app sends chat requests to a same-origin `/api/zynx` endpoint; a small Node.js HTTP server calls Gemini. The API key is read only by that server and is never placed in a `VITE_` variable, source file, or browser request.

1. Copy `.env.example` to `.env` in the repository root.
2. Replace `GEMINI_API_KEY=your_gemini_api_key` with your Gemini API key. Keep `.env` private; it is ignored by Git. Never paste the key into source code, a `VITE_` variable, or a chat.
3. Keep `GEMINI_MODEL=gemini-3.6-flash` or choose a model enabled for your Gemini API project.
4. In one terminal run `npm run dev`; in a second terminal run `npm run dev:server`.
5. Open `/zynx` or use the application-wide **Ask ZYNX** button. If the key is not configured, ZYNX reports that setup is required and does not simulate answers.

For production, build with `npm run build`, run `npm run start:server` with the server environment configured, and route same-origin `/api` requests from the web server/reverse proxy to the ZYNX API service. Set `HOST` as appropriate for the deployment. Do not publish the API key with static frontend assets. The Vite development server proxies `/api` to `127.0.0.1:4174`.

The default model is the stable `gemini-3.6-flash` model documented by [Google AI](https://ai.google.dev/gemini-api/docs/models/gemini-3.6-flash), using the [Gemini generateContent API](https://ai.google.dev/api/generate-content). Gemini availability, quota, and any account-specific billing terms are controlled by Google; no API key was included or used to verify a live model response during development.

Chat history is held in application memory only and is cleared on reload or with **Clear chat**. A preferred name is session-only unless the user opts in to saving that name in this browser; the opt-in can be revoked using **Forget name**. Chat messages are sent to Google Gemini only when the user submits a message. The backend applies input, request-size, timeout, and in-memory per-remote-address rate limits, and does not log prompts or API keys. ZYNX has no browser, file, shell, or browsing tools; its plain-text output is not treated as verified security analysis. The in-memory rate limit resets when the server restarts and is not a substitute for production edge controls.

## Security and privacy principles

- Keep AI access and key handling server-side.
- Avoid exposing secrets in browser code or Vite environment values.
- Keep essential app functionality usable without a Gemini API key.
- Treat suspicious indicators and confirmed malicious activity as different states.
- Preserve user control over personalization, progress, and persisted data.
