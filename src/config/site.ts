export const appName = 'PhisGuard';
export const appTagline = 'Think Before You Click.';

export const navItems = [
  { to: '/', label: 'Home' },
  { to: '/learn', label: 'Learn' },
  { to: '/inspector', label: 'URL Inspector' },
  { to: '/practice', label: 'Practice Lab' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/assessments', label: 'Assessments' },
  { to: '/progress', label: 'Progress' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/resources', label: 'Resources' },
  { to: '/zynx', label: 'ZYNX' },
] as const;

export const featureHighlights = [
  {
    title: 'Learn the signals',
    description: 'Build a practical foundation for spotting suspicious messages, spoofed links, and social engineering patterns.',
  },
  {
    title: 'Inspect URLs safely',
    description: 'Prepare a transparent inspection workflow that explains local heuristics without claiming certainty from a single check.',
  },
  {
    title: 'Practice decisions',
    description: 'Reinforce trained judgment through realistic simulations, feedback prompts, and decision-based scenarios.',
  },
  {
    title: 'Track progress locally',
    description: 'Support personal learning stats with user-controlled persistence and a privacy-first local-first model.',
  },
] as const;
