# PhisGuard

> **Think Before You Click.**

PhisGuard is an educational cybersecurity and phishing-awareness platform designed to empower users to pause, inspect, and evaluate digital threats before taking action. Built with a Swiss Minimalist aesthetic supporting both Light Mode and Dark Mode, PhisGuard combines privacy-first client-side tools with server-side AI integration to deliver a practical and reliable learning experience.

Repository: [https://github.com/rcryptx/PhisGuard-rcryptx-](https://github.com/rcryptx/PhisGuard-rcryptx-)

---

## Project Status

PhisGuard is feature-complete for its core learning experience and has completed a
final UI/UX polish and release-readiness pass. The application builds and runs
locally and is configured for deployment, but this repository does **not** assert a
particular live production URL or deployment state.

- **Implemented and usable**: Home, Learning Centre and lessons, URL Inspector
  (with a URL anatomy breakdown), Practice Lab, Assessments and results, Progress
  tracking, Cybersecurity Glossary (104 terms across 12 categories), Resources
  Directory, and Light/Dark themes.
- **Requires server configuration**: ZYNX (Google Gemini). Without an API key, ZYNX
  transparently reports that server setup is required; every other feature keeps
  working.
- **In development**: Flashcards (`/flashcards`) is scaffolded with an explicit
  placeholder and has no deck content yet.

### Deployment Configuration

- **Vercel**: Configured for deployment with serverless functions in `api/zynx/`
  and rewrite rules in `vercel.json`.
- **Render**: Includes a `render.yaml` blueprint for unified container/service
  hosting.

---

## Features Overview

1. **Dashboard & Learning Centre (`/learn`)**
   - Curated cybersecurity curriculum covering fundamental attack vectors: email phishing, smishing, vishing, spear phishing, credential harvesting, malware delivery, QR code deception (quishing), and social engineering tactics.
   - Real-world case analyses, tactical defense indicators, and actionable verification checklists.

2. **Privacy-First URL Inspector (`/inspector`)**
   - Pure client-side static heuristic engine analyzing structural anomalies in URLs without network exposure.
   - Evaluates IP-address hosts, brand impersonation homoglyphs, excessive subdomains, suspicious TLDs, and path trickery.
   - **URL anatomy explorer**: breaks a submitted URL into its structural parts (scheme, host, subdomains, registrable domain, path, query) and links each part to the relevant indicators.
   - Honest security stance: explains structural signals only. It never visits the URL, checks live reputation, or returns a definitive "safe" or "malicious" verdict.

3. **Practice Lab (`/practice`)**
   - Interactive, simulated phishing scenario training environment.
   - Real-world email and message prompts requiring users to inspect headers, links, and content to identify safe vs. malicious characteristics.
   - Explanations and performance recaps after every scenario.

4. **Curriculum-Aligned Assessments (`/assessments`)**
   - Structured assessments covering foundational cybersecurity concepts.
   - Deterministic scoring engine with detailed answer rationales and domain-specific feedback.

5. **Local Learning Progress (`/progress`)**
   - Explicit, privacy-respecting progress tracking stored in browser `localStorage` (`phisguard.learning-progress`).
   - Tracks completion metrics, percentages, and activity logs without external trackers or cloud account requirements.

6. **Curated Resources Directory (`/resources`)**
   - Direct references to authoritative guidelines from CISA (Cybersecurity & Infrastructure Security Agency) and UK NCSC (National Cyber Security Centre).
   - Cross-linked with relevant internal curriculum lessons for context.

7. **Cybersecurity Glossary (`/glossary`)**
   - Locally bundled glossary of **104 cybersecurity terms across 12 categories**, each with a concise definition, a plain-language explanation, and a practical example.
   - Full-text search across terms, definitions, and keywords, plus filtering by category and difficulty, sorting, and an A–Z term detail view.
   - Privacy-first study aids stored only in your browser: bookmarked terms and a recently viewed list (`phisguard.glossary-bookmarks`, `phisguard.glossary-recent`).
   - Cross-linked to related terms and relevant Learning Centre lessons, with light/dark responsive accessible design.

8. **ZYNX AI Security Companion (`/zynx`)**
   - Educational AI assistant powered by Google Gemini (default: `gemini-3.6-flash`).
   - Strict architectural boundaries: all Gemini API interactions use Google's official `@google/genai` SDK on the server via a secure Node.js proxy or Vercel serverless function (`/api/zynx/chat` and `/api/zynx/status`).
   - Safeguards: validated request limits, rate limiting, bounded responses, and session-only context retention.
   - Graceful fallback: when unconfigured, the app presents a transparent setup requirement rather than fabricated answers.

9. **Design & Theming**
   - Designed following Swiss Minimalist typography and layout principles: high contrast, clean slate neutrals, and functional information hierarchy.
   - Native Light Mode and Dark Mode support with persistent state (`phisguard.theme`) and system preference detection.
   - Fully responsive for mobile, tablet, and desktop viewing.

10. **In-Development Features**
   - **Flashcards (`/flashcards`)**: The data model and types (`src/features/flashcards/types.ts`) are scaffolded for future spaced-repetition decks, with an explicit in-development notice displayed on the route.

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS (with `darkMode: "class"`), React Router 7.
- **Backend / API**: Node.js HTTP server + Vercel Serverless Functions (`api/zynx/`).
- **AI Integration**: Google Gemini API via the official server-side `@google/genai` SDK (`gemini-3.6-flash`).
- **Icons**: Lucide React (`lucide-react`) with a consistent stroke and sizing system.
- **Testing & Quality**: Vitest, React Testing Library, JSDOM, Node.js Test Runner, Oxlint, Prettier.

---

## Architectural Overview

```
                        +------------------------------+
                        |      Client (Browser)        |
                        |  React 19 + Tailwind CSS     |
                        +--------------+---------------+
                                       |
                      Same-Origin HTTP Requests (/api/zynx/*)
                                       |
                        +--------------v---------------+
                        |    Serverless / Proxy API   |
                        |  Vercel Serverless / Node   |
                        |  (server/zynxService.ts)    |
                        +--------------+---------------+
                                       |
                        Server-side Google Gen AI SDK
                        (x-goog-api-key: GEMINI_API_KEY)
                                       |
                        +--------------v---------------+
                        |      Google Gemini API      |
                        |     (gemini-3.6-flash)      |
                        +------------------------------+
```

### Core Architecture & Privacy Principles

- **Zero Client-Side Secrets**: API keys are strictly forbidden from browser builds and `VITE_` prefixed variables. Only the server/serverless layer accesses `GEMINI_API_KEY`.
- **Local Heuristics Stay Local**: URL Inspector processes inputs entirely in-browser. URLs are never sent to external servers or logged.
- **Fail Gracefully**: If Gemini is not configured, ZYNX accurately reports that server setup is required. Core application features (Learn, URL Inspector, Practice Lab, Assessments, Progress, Resources, Glossary) remain fully functional offline or without an API key.
- **Bundled Reference Content**: The Cybersecurity Glossary ships as local, typed data (`src/features/glossary/terms.ts`). No definitions, search queries, bookmarks, or recently viewed terms are sent to any external service.

---

## Getting Started

### Prerequisites

- Node.js 22.x or later
- npm 10.x or later

### Installation

```bash
git clone https://github.com/rcryptx/PhisGuard-rcryptx-.git
cd PhisGuard-rcryptx-
npm install
```

### Environment Configuration

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Contents of `.env`:
```env
VITE_APP_NAME=PhisGuard
VITE_APP_TAGLINE="Think Before You Click."

# Server-only Gemini configuration. Never prefix with VITE_.
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash

# Optional local API server settings
PORT=4174
HOST=127.0.0.1
```

> **Note**: An API key is only required if you wish to query the optional ZYNX assistant. All other features function independently.

### Running Locally

To run both the frontend and the local ZYNX proxy server:

1. **Terminal 1** (ZYNX Backend Proxy):
   ```bash
   npm run dev:server
   ```
2. **Terminal 2** (Vite Frontend):
   ```bash
   npm run dev -- --host
   ```

The application will be available at `http://localhost:5173`.

---

## Available Scripts

- `npm run dev` -- Launch Vite frontend development server.
- `npm run dev:server` -- Compile and run local Node.js ZYNX API proxy on port 4174.
- `npm run build` -- Typecheck frontend and server, then build production client bundle.
- `npm run lint` -- Run Oxlint code analysis.
- `npm run test` -- Execute both frontend (Vitest) and server-side (Node Test Runner) test suites.
- `npm run test:server` -- Run isolated Node.js test runner suite for ZYNX service.
- `npm run format` -- Run Prettier formatting.
- `npm run preview` -- Preview the production Vite build locally.

---

## Deployment Instructions

### Vercel Deployment (Recommended)

PhisGuard is configured out-of-the-box for Vercel deployment:

1. Import the repository into your Vercel Dashboard.
2. In Project Settings > Environment Variables, add:
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `GEMINI_MODEL`: `gemini-3.6-flash` (optional, defaults to `gemini-3.6-flash`).
3. Deploy. Vercel automatically detects Vite, executes `npm run build`, exposes the frontend SPA, and hosts the serverless functions in `api/zynx/status.ts` and `api/zynx/chat.ts` according to `vercel.json`.

### Render Deployment

A `render.yaml` blueprint is included for deploying to Render:

1. Connect your repository to Render as a Blueprint or Web Service.
2. Configure `GEMINI_API_KEY` under Environment Variables.
3. Build command: `npm install && npm run build`.
4. Start command: `npm run start:server`.

---

## Security Limitations & Disclaimers

1. **Educational Purpose**: PhisGuard is developed as an educational project. The URL Inspector uses static pattern-matching heuristics and is not an antivirus scanner or a real-time threat-intelligence feed.
2. **No Definitive URL Verdict**: The URL Inspector analyzes structure only. It does not load, resolve, fetch, or execute the submitted URL, and it cannot establish that a link is definitively safe or definitively malicious. A clean result is not a guarantee; a flagged result is a prompt to verify, not proof of harm.
3. **AI Advice**: ZYNX responses are generated by Google Gemini and should be treated as educational guidance, not certified security audits. ZYNX has no browser, filesystem, or network tools and cannot verify that a URL, file, or system is safe.
4. **Privacy**: Personalization data (name, theme preference, completed lessons, glossary bookmarks and history) is strictly confined to your local browser storage and is never sent to an external service.

---

## Known Limitations

- **Flashcards** (`/flashcards`) is a scaffolded placeholder; no study decks are available yet.
- **ZYNX** depends on server-side Gemini configuration. When the key is absent or the API is unreachable, ZYNX shows a clear setup or error state instead of an answer.
- **Progress, bookmarks, and theme** are stored per browser via `localStorage`; they are not synced across devices and are cleared if browser storage is cleared.
- **Assessments and Practice Lab** use a fixed, deterministic question/scenario bank bundled with the app; results are not transmitted anywhere.

---

## Author & Credits

- **Project Lead / Developer**: Rahul ([@rcryptx](https://github.com/rcryptx) / [coder-r4hxl](https://github.com/coder-r4hxl))
- **Program**: CodeAlpha Cybersecurity Internship
- **License**: MIT
