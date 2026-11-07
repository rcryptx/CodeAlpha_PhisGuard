# Contributing

## Local setup

1. Install dependencies: `npm install`
2. Start the app: `npm run dev`
3. Validate the app: `npm run test` and `npm run build`

## Coding approach

- Keep the app modular and feature-oriented.
- Avoid broad abstractions before a need is clear.
- Prefer local-first and privacy-conscious behavior.
- Keep future AI and external service integration behind clear boundaries.

## Checks before pull requests

- TypeScript build passes.
- Tests pass.
- Linting is clean.
- No secrets or `.env` values are committed.
