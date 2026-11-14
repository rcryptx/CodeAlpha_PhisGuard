import {
  lessons,
  lessonCategories,
  lessonBySlug,
} from "@/features/learning/curriculum";

import type { CardDifficulty, Flashcard, FlashcardDeck } from "./types";

interface CardSeed {
  lessonSlug: string;
  question: string;
  answer: string;
  keywords: string[];
  difficulty: CardDifficulty;
}

/**
 * Curated question/answer pairs written directly from the wording of the
 * twelve Learning Centre lessons. Each card is grounded in a specific lesson
 * concept rather than generated boilerplate, so the decks stay accurate to the
 * curriculum. Cards never depend on Gemini or any network call.
 */
const cardSeeds: CardSeed[] = [
  // 1. Introduction to phishing
  {
    lessonSlug: "introduction-to-phishing",
    question: "What is a phishing message usually trying to achieve?",
    answer:
      "Getting someone to reveal information, open a harmful file, send money, or take another action that benefits an attacker.",
    keywords: ["definition", "goal", "social engineering"],
    difficulty: "intro",
  },
  {
    lessonSlug: "introduction-to-phishing",
    question:
      "Do correct spelling and polished design prove that a message is genuine?",
    answer:
      "No. Names, logos, and clean formatting can be imitated, so a polished message still needs to be verified.",
    keywords: ["warning signs", "look-alike", "design"],
    difficulty: "intro",
  },
  {
    lessonSlug: "introduction-to-phishing",
    question:
      "A message pressures you to act immediately. Is urgency by itself proof of phishing?",
    answer:
      "No. Urgency or any single clue is a reason to check, not automatic proof — legitimate messages can also be unexpected or urgent.",
    keywords: ["urgency", "pressure", "verification"],
    difficulty: "intro",
  },
  {
    lessonSlug: "introduction-to-phishing",
    question: "What is a safer way to verify an unexpected request?",
    answer:
      "Use a contact method you already trust — such as a known phone number, a bookmark, or the official app — instead of the link or number in the message.",
    keywords: ["verification", "trusted channel"],
    difficulty: "intro",
  },
  {
    lessonSlug: "introduction-to-phishing",
    question: "Name a warning sign that a message may be a phishing attempt.",
    answer:
      "An unexpected request for passwords, payment, personal data, or an approval — or a sender or contact method you cannot independently verify.",
    keywords: ["warning signs", "unexpected request"],
    difficulty: "medium",
  },

  // 2. Email phishing
  {
    lessonSlug: "email-phishing",
    question:
      "What should you inspect instead of relying on an email's display name?",
    answer:
      "The full sender address and the reply-to address. A display name can be chosen by the sender and does not verify identity.",
    keywords: ["sender address", "reply-to", "display name"],
    difficulty: "intro",
  },
  {
    lessonSlug: "email-phishing",
    question: "An email links to a sign-in page. What is the safer approach?",
    answer:
      "Open the service through a known bookmark or its official app instead of using the email link.",
    keywords: ["links", "sign-in", "bookmark"],
    difficulty: "intro",
  },
  {
    lessonSlug: "email-phishing",
    question: "Why should you be cautious with an unexpected attachment?",
    answer:
      "Unexpected files can exploit trust or curiosity and may prompt risky actions. Do not open one just to find out whether it is safe.",
    keywords: ["attachments", "unexpected file"],
    difficulty: "intro",
  },
  {
    lessonSlug: "email-phishing",
    question:
      "A message from a 'manager' asks for gift cards before a meeting. What should the employee do?",
    answer:
      "Confirm the request with the manager using a trusted channel such as the company directory, not by replying to the email.",
    keywords: ["gift card", "impersonation", "callback"],
    difficulty: "medium",
  },
  {
    lessonSlug: "email-phishing",
    question:
      "True or false: a familiar display name means an email is authentic.",
    answer: "False. A familiar name or a polished email is not authentication.",
    keywords: ["authentication", "display name"],
    difficulty: "intro",
  },

  // 3. SMS phishing (smishing)
  {
    lessonSlug: "sms-phishing-smishing",
    question: "What is smishing?",
    answer:
      "Phishing delivered through SMS or a similar text-messaging channel.",
    keywords: ["sms", "text message", "definition"],
    difficulty: "intro",
  },
  {
    lessonSlug: "sms-phishing-smishing",
    question:
      "A text claims a parcel is held until you pay a small fee through a link. What should you do?",
    answer:
      "Check the delivery status through the carrier's official app and do not enter payment details on the linked page.",
    keywords: ["delivery", "fee", "links"],
    difficulty: "intro",
  },
  {
    lessonSlug: "sms-phishing-smishing",
    question:
      "Why can a text that appears in a thread with legitimate messages still be risky?",
    answer:
      "A thread or sender name looking familiar does not prove that a message is genuine.",
    keywords: ["trust", "thread", "sender"],
    difficulty: "medium",
  },
  {
    lessonSlug: "sms-phishing-smishing",
    question: "Should you read a one-time sign-in code to someone who texts you?",
    answer:
      "No. Treat requests for sign-in codes as highly sensitive and never share them.",
    keywords: ["one-time code", "otp", "sensitive"],
    difficulty: "intro",
  },
  {
    lessonSlug: "sms-phishing-smishing",
    question: "How should you verify a text that claims to be from your bank?",
    answer:
      "Open the official app or use contact details from a trusted source — never the phone number or link supplied only by the message.",
    keywords: ["bank", "verification", "official app"],
    difficulty: "intro",
  },

  // 4. Voice phishing (vishing)
  {
    lessonSlug: "voice-phishing-vishing",
    question: "What is vishing?",
    answer: "Phishing carried out through phone or voice calls.",
    keywords: ["phone call", "voice", "definition"],
    difficulty: "intro",
  },
  {
    lessonSlug: "voice-phishing-vishing",
    question: "Does a correct caller ID prove who is really calling?",
    answer:
      "No. Caller ID can be misleading, and a caller may already know some real details about you.",
    keywords: ["caller id", "spoofing", "identity"],
    difficulty: "intro",
  },
  {
    lessonSlug: "voice-phishing-vishing",
    question:
      "A caller claiming to be tech support asks you to install remote-access software. What should you do?",
    answer:
      "End the call and contact support using a published internal or official number.",
    keywords: ["remote access", "tech support", "callback"],
    difficulty: "medium",
  },
  {
    lessonSlug: "voice-phishing-vishing",
    question: "How do you 'take control of the callback' after a suspicious call?",
    answer:
      "End the unexpected call, then reconnect using a number from the organization's official website, your bank card, or a trusted directory.",
    keywords: ["callback", "trusted number"],
    difficulty: "intro",
  },
  {
    lessonSlug: "voice-phishing-vishing",
    question:
      "A caller asks you to approve a sign-in you did not start. What is the right response?",
    answer:
      "Do not approve it. Only approve sign-ins that you initiated and recognize.",
    keywords: ["mfa prompt", "sign-in", "approval"],
    difficulty: "intro",
  },

  // 5. Spear phishing and targeted attacks
  {
    lessonSlug: "spear-phishing-and-targeted-attacks",
    question: "What makes spear phishing different from a generic lure?",
    answer:
      "It is tailored to a specific person or group, often using real details to make the request seem credible.",
    keywords: ["targeted", "personalisation", "definition"],
    difficulty: "intro",
  },
  {
    lessonSlug: "spear-phishing-and-targeted-attacks",
    question:
      "A message references a real project. Does that prove it is legitimate?",
    answer:
      "No. Personal details can be gathered and reused, so tailored messages still require independent verification.",
    keywords: ["personalisation", "verification"],
    difficulty: "medium",
  },
  {
    lessonSlug: "spear-phishing-and-targeted-attacks",
    question: "What is business email compromise (BEC)?",
    answer:
      "A related pattern where an attacker impersonates or takes over a business account to influence payments, payroll changes, or sensitive data sharing.",
    keywords: ["bec", "impersonation", "payments"],
    difficulty: "advanced",
  },
  {
    lessonSlug: "spear-phishing-and-targeted-attacks",
    question:
      "How should you handle a tailored but unexpected request for confidential files or payment?",
    answer:
      "Confirm it with the person using a separate known channel, and follow established approval steps.",
    keywords: ["approval", "confidential data", "verification"],
    difficulty: "medium",
  },
  {
    lessonSlug: "spear-phishing-and-targeted-attacks",
    question:
      "Why use a second approver for financial or high-impact account changes?",
    answer:
      "Consistent approval procedures help resist urgency and impersonation.",
    keywords: ["segregation of duties", "process"],
    difficulty: "medium",
  },

  // 6. Fake websites and domain spoofing
  {
    lessonSlug: "fake-websites-and-domain-spoofing",
    question:
      "In the address accounts.example.com, which part is the registered domain?",
    answer:
      "'example' is the registered domain — the part directly before the top-level domain. 'accounts' is a subdomain.",
    keywords: ["domain", "subdomain", "url"],
    difficulty: "intro",
  },
  {
    lessonSlug: "fake-websites-and-domain-spoofing",
    question: "What does the HTTPS lock icon actually prove?",
    answer:
      "That the connection is encrypted — not that the site belongs to the company it claims to represent, or that it is safe to use.",
    keywords: ["https", "tls", "lock icon"],
    difficulty: "intro",
  },
  {
    lessonSlug: "fake-websites-and-domain-spoofing",
    question:
      "Where can a brand name appear in a spoofed address without the brand controlling the real domain?",
    answer:
      "In a subdomain or in the path after the domain. The registered domain is what identifies the site operator.",
    keywords: ["lookalike", "path", "subdomain"],
    difficulty: "medium",
  },
  {
    lessonSlug: "fake-websites-and-domain-spoofing",
    question: "How should you reach a sensitive service such as banking?",
    answer:
      "Through a bookmark, official app, or an address you type yourself — not a link from an unexpected message.",
    keywords: ["bookmark", "trusted route"],
    difficulty: "intro",
  },
  {
    lessonSlug: "fake-websites-and-domain-spoofing",
    question: "Name a warning sign of a fake website.",
    answer:
      "A domain with a subtle spelling change or an unexpected ending, or a sign-in page reached through an unexpected message, text, or advertisement.",
    keywords: ["typosquatting", "warning signs"],
    difficulty: "medium",
  },

  // 7. Malicious links and attachments
  {
    lessonSlug: "malicious-links-and-attachments",
    question: "Does a link's visible text always match its destination?",
    answer:
      "No. Visible link text may differ from the address it opens, and link shorteners can hide the final destination.",
    keywords: ["hyperlinks", "shortener", "destination"],
    difficulty: "intro",
  },
  {
    lessonSlug: "malicious-links-and-attachments",
    question:
      "A document says you must enable macros or active content to view it. What should you do?",
    answer:
      "Do not enable it. Confirm with the sender through a separate channel and report the message using your organization's process.",
    keywords: ["macros", "active content", "attachments"],
    difficulty: "medium",
  },
  {
    lessonSlug: "malicious-links-and-attachments",
    question:
      "Is a link preview or a security scan a guarantee that a link or file is safe?",
    answer:
      "No. Previews and scans reduce risk but do not guarantee that every harmful file or link will be detected.",
    keywords: ["preview", "antivirus", "limitations"],
    difficulty: "medium",
  },
  {
    lessonSlug: "malicious-links-and-attachments",
    question: "What should you do if you opened a suspicious file?",
    answer:
      "Contact your organization's support or security team promptly and explain what happened.",
    keywords: ["incident", "reporting"],
    difficulty: "intro",
  },
  {
    lessonSlug: "malicious-links-and-attachments",
    question:
      "Why should you avoid bypassing a browser warning to open unexpected content?",
    answer:
      "Bypassing warnings or enabling active content can expose data or compromise a device.",
    keywords: ["browser warning", "risk"],
    difficulty: "intro",
  },

  // 8. Social engineering techniques
  {
    lessonSlug: "social-engineering",
    question: "Name three influence tactics used in deceptive requests.",
    answer:
      "Authority, urgency, fear, curiosity, or reward — used to push a target toward acting without checking.",
    keywords: ["influence", "tactics", "manipulation"],
    difficulty: "intro",
  },
  {
    lessonSlug: "social-engineering",
    question: "Does a friendly conversation make a later request safe?",
    answer:
      "No. An attacker may build rapport or start with harmless questions before making a consequential request. Normal verification still applies.",
    keywords: ["rapport", "pretext"],
    difficulty: "medium",
  },
  {
    lessonSlug: "social-engineering",
    question:
      "What reliable response helps interrupt social-engineering pressure?",
    answer:
      "Pause, identify what the person wants you to do, and verify through an independent channel.",
    keywords: ["pause", "verification"],
    difficulty: "intro",
  },
  {
    lessonSlug: "social-engineering",
    question:
      "Is there a single emotion or message style that proves an attack?",
    answer:
      "No. These are examples of tactics, not a checklist that can identify every scam.",
    keywords: ["limitations", "tactics"],
    difficulty: "medium",
  },
  {
    lessonSlug: "social-engineering",
    question:
      "A caller asks you to urgently change a supplier's bank details. What should you do?",
    answer:
      "Follow the normal change-control process and confirm with the person using a known contact method.",
    keywords: ["change control", "payment", "verification"],
    difficulty: "medium",
  },

  // 9. Password and account security
  {
    lessonSlug: "password-and-account-security",
    question: "Why is reusing a password risky?",
    answer:
      "If one service is breached, a reused password can put your other accounts at risk.",
    keywords: ["password reuse", "breach"],
    difficulty: "intro",
  },
  {
    lessonSlug: "password-and-account-security",
    question:
      "What kind of tool can generate and remember unique passwords for you?",
    answer:
      "A reputable password manager, protected with a strong password and multifactor authentication where supported.",
    keywords: ["password manager", "uniqueness"],
    difficulty: "intro",
  },
  {
    lessonSlug: "password-and-account-security",
    question: "What should you do if you think a password was exposed?",
    answer:
      "Change it through the service's official app or website, change any reused passwords, and review active sessions and recovery settings.",
    keywords: ["incident response", "recovery", "sessions"],
    difficulty: "medium",
  },
  {
    lessonSlug: "password-and-account-security",
    question: "Which accounts should get multifactor authentication first?",
    answer:
      "Email and financial accounts especially, along with other important accounts.",
    keywords: ["mfa", "priority", "email"],
    difficulty: "intro",
  },
  {
    lessonSlug: "password-and-account-security",
    question: "Name a warning sign of possible account compromise.",
    answer:
      "A sign-in alert you do not recognize, a password reset you did not request, or unexpected changes to recovery details or active sessions.",
    keywords: ["warning signs", "account takeover"],
    difficulty: "medium",
  },

  // 10. Multi-factor authentication
  {
    lessonSlug: "multi-factor-authentication",
    question: "What does multifactor authentication (MFA) add to a sign-in?",
    answer:
      "Another check beyond a password — something you have (for example an authenticator app or security key) or something you are (for example a biometric).",
    keywords: ["mfa", "factors", "definition"],
    difficulty: "intro",
  },
  {
    lessonSlug: "multi-factor-authentication",
    question:
      "You receive several MFA approval prompts that you did not start. What should you do?",
    answer:
      "Deny or ignore them and review the account through its official app or website.",
    keywords: ["prompt bombing", "mfa", "deny"],
    difficulty: "medium",
  },
  {
    lessonSlug: "multi-factor-authentication",
    question:
      "Should you share a one-time code with a caller who says they are support?",
    answer:
      "No. Never disclose one-time codes, and never approve a sign-in you did not initiate.",
    keywords: ["one-time code", "support scam"],
    difficulty: "intro",
  },
  {
    lessonSlug: "multi-factor-authentication",
    question:
      "Do passkeys and security keys offer stronger phishing resistance than codes?",
    answer:
      "Yes. Where available, phishing-resistant options such as passkeys or security keys are worth using.",
    keywords: ["passkey", "security key", "phishing-resistant"],
    difficulty: "advanced",
  },
  {
    lessonSlug: "multi-factor-authentication",
    question: "True or false: MFA removes all phishing risk.",
    answer:
      "False. MFA reduces the risk of account takeover but does not eliminate phishing risk.",
    keywords: ["mfa", "limitations"],
    difficulty: "intro",
  },

  // 11. Safe browsing habits
  {
    lessonSlug: "safe-browsing-habits",
    question: "What is a safer way to reach important online services?",
    answer:
      "Use bookmarks, official apps, or addresses you already know, rather than search ads or unsolicited links.",
    keywords: ["bookmarks", "habits", "search ads"],
    difficulty: "intro",
  },
  {
    lessonSlug: "safe-browsing-habits",
    question: "Why does it matter to keep your browser and operating system updated?",
    answer:
      "Updates can include security fixes, so delaying them unnecessarily increases risk.",
    keywords: ["updates", "patching"],
    difficulty: "intro",
  },
  {
    lessonSlug: "safe-browsing-habits",
    question:
      "A website asks you to install an extension or certificate. What should you do?",
    answer:
      "Do not install software, extensions, or certificates at the direction of an unexpected site or caller; use trusted sources.",
    keywords: ["extensions", "certificates", "unexpected install"],
    difficulty: "medium",
  },
  {
    lessonSlug: "safe-browsing-habits",
    question:
      "What should you do about a browser warning that a page or download may be unsafe?",
    answer:
      "Do not bypass it. Treat the warning as a reason to stop and check what you were doing.",
    keywords: ["browser warning", "download"],
    difficulty: "intro",
  },
  {
    lessonSlug: "safe-browsing-habits",
    question: "Does HTTPS mean a website is legitimate?",
    answer:
      "No. A lock icon indicates an encrypted connection, not that the site is genuine or safe.",
    keywords: ["https", "misconception"],
    difficulty: "intro",
  },

  // 12. Reporting suspicious activity
  {
    lessonSlug: "reporting-suspicious-activity",
    question: "How should you report a suspicious message at work?",
    answer:
      "Use your organization's reporting button or contact its IT or security team through the directory — do not reply to the suspicious sender.",
    keywords: ["reporting", "process"],
    difficulty: "intro",
  },
  {
    lessonSlug: "reporting-suspicious-activity",
    question: "What useful information should a report include?",
    answer:
      "What happened and when, and whether you clicked, opened, replied, paid, or shared information.",
    keywords: ["reporting", "detail"],
    difficulty: "medium",
  },
  {
    lessonSlug: "reporting-suspicious-activity",
    question:
      "You realize you entered a work password on a page reached from an unexpected message. What should you do?",
    answer:
      "Report it to the security team immediately, then follow their instructions for changing the password and reviewing sessions.",
    keywords: ["incident response", "credentials", "reporting"],
    difficulty: "medium",
  },
  {
    lessonSlug: "reporting-suspicious-activity",
    question: "Why report even if you already interacted with a message?",
    answer:
      "Quick reporting can help limit harm. Do not hide a mistake — it makes the problem harder to contain.",
    keywords: ["reporting", "containment"],
    difficulty: "intro",
  },
  {
    lessonSlug: "reporting-suspicious-activity",
    question: "If money may be at risk, who should you contact and how?",
    answer:
      "Contact the bank or payment provider using a trusted, known number.",
    keywords: ["bank", "payment", "reporting"],
    difficulty: "medium",
  },
];

function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : text;
}

/** Builds stable, per-deck card ids such as `email-phishing-1`. */
function buildFlashcards(): Flashcard[] {
  const counters = new Map<string, number>();
  return cardSeeds.map((seed) => {
    const position = (counters.get(seed.lessonSlug) ?? 0) + 1;
    counters.set(seed.lessonSlug, position);
    return {
      id: `${seed.lessonSlug}-${position}`,
      deckId: seed.lessonSlug,
      question: seed.question,
      answer: seed.answer,
      keywords: seed.keywords,
      difficulty: seed.difficulty,
      lessonSlug: seed.lessonSlug,
    };
  });
}

/** The full card catalogue. One deck is created per Learning Centre lesson. */
export const flashcards: Flashcard[] = buildFlashcards();

export const flashcardDecks: FlashcardDeck[] = lessons.map((lesson) => ({
  id: lesson.slug,
  title: lesson.title,
  category: lesson.category,
  description: firstSentence(lesson.introduction),
  lessonSlug: lesson.slug,
  cardIds: flashcards
    .filter((card) => card.deckId === lesson.slug)
    .map((card) => card.id),
}));

const deckById = new Map(flashcardDecks.map((deck) => [deck.id, deck]));
const cardById = new Map(flashcards.map((card) => [card.id, card]));
const categoryByDeckId = new Map(
  flashcardDecks.map((deck) => [deck.id, deck.category]),
);

export const flashcardCategoryOptions = lessonCategories.map(
  (category) => category.name,
);

export const getFlashcardDeck = (deckId: string) => deckById.get(deckId);

export const getFlashcard = (cardId: string) => cardById.get(cardId);

export const getDeckCards = (deckId: string) =>
  flashcards.filter((card) => card.deckId === deckId);

export const getDeckCardsById = (cardIds: string[]) =>
  cardIds
    .map((cardId) => cardById.get(cardId))
    .filter((card): card is Flashcard => Boolean(card));

export const getCardsByCategory = (category: string) =>
  flashcards.filter((card) => categoryByDeckId.get(card.deckId) === category);

export const getCardCategory = (card: Flashcard) =>
  categoryByDeckId.get(card.deckId);

export const getLessonTitleForCard = (card: Flashcard) =>
  lessonBySlug(card.lessonSlug)?.title ?? "Learning Centre lesson";
