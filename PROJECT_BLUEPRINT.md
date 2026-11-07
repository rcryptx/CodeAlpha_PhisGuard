# Project Blueprint

## Product vision

PhisGuard is a phishing-awareness and cybersecurity education platform designed to help users stop, inspect, and verify before they click. The platform is intentionally architecture-first so future learning modules, simulations, and AI support can expand without breaking the foundation.

## Product priorities

- Learning-centric security education
- Safe local-first URL inspection boundaries
- Realistic practice scenarios and assessments
- Research-backed educational resources
- Privacy-conscious AI companion support via ZYNX

## Technical foundation

- React + TypeScript + Vite
- Strict TypeScript configuration
- Tailwind CSS for styling and responsive layout primitives
- React Router for route boundaries and page composition
- Modular, feature-led project structure for future growth

## Feature boundaries

- Home: landing and summary experience
- Learn: educational modules and training pathways
- URL Inspector: safe URL-analysis workflows with explainable heuristics
- Practice Lab: interactive decision exercises and explanations
- Flashcards: deck and review architecture for future spaced repetition
- Assessments: deterministic scoring and quiz structure
- Progress: local-first user tracking and learning history
- Resources: maintainable reference material and learning sources
- ZYNX: AI companion scaffolding with explicit security and privacy guardrails

## Security principles

- Keep API calls server-side.
- Never expose secrets in the browser.
- Keep core functionality working without an API key.
- Never claim certainty from incomplete heuristics.
- Require clear consent for any personal data or memory features.
