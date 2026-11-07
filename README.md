# PhisGuard

PhisGuard is a phishing-awareness and cybersecurity education platform built to help users pause, inspect, and verify before they click. The app provides a modular foundation for learning, URL inspection, simulation-driven practice, flashcards, assessments, progress tracking, and future AI guidance.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Vitest + Testing Library

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the development server
- `npm run build` — run TypeScript checks and produce a production build
- `npm run lint` — run static analysis
- `npm run test` — run the frontend test suite
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

The Learning Centre, local URL Inspector, Practice Lab, curriculum-aligned Assessments, and lesson progress tracking are functional. Flashcards, resources, and ZYNX remain under development.

## Local learning progress

Lesson completion is explicit: opening a lesson does not mark it complete. Learners can mark a lesson complete or reopen it from the lesson page. Completion records are stored in the browser's `localStorage` under the versioned `phisguard.learning-progress` key and validated against current curriculum slugs when read. The Progress page derives completion counts, percentage, and recent activity from those records. Clearing browser data removes the saved progress; there is no account, cloud sync, or permanent assessment-result storage.

## Security and privacy principles

- Keep AI access and key handling server-side.
- Avoid exposing secrets in browser code or Vite environment values.
- Keep essential app functionality usable without a Gemini API key.
- Treat suspicious indicators and confirmed malicious activity as different states.
- Preserve user control over personalization, progress, and persisted data.
