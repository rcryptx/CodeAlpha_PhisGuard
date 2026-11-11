import { lessons } from "@/features/learning/curriculum";

import type { AssessmentDifficulty, AssessmentQuestion } from "./types";

type OptionLetter = "a" | "b" | "c" | "d";
type QuestionDefinition = {
  id: string;
  topic: string;
  difficulty: AssessmentDifficulty;
  prompt: string;
  answers: [string, string, string, string];
  correct: OptionLetter;
  explanation: string;
  objective: string;
  context?: string;
};

const question = ({
  id,
  topic,
  difficulty,
  prompt,
  answers,
  correct,
  explanation,
  objective,
  context,
}: QuestionDefinition): AssessmentQuestion => ({
  id,
  topicSlug: topic,
  difficulty,
  prompt,
  options: answers.map((text, index) => ({
    id: `${id}-${(["a", "b", "c", "d"] as const)[index]}`,
    text,
  })),
  correctOptionId: `${id}-${correct}`,
  explanation,
  learningObjective: objective,
  lessonSlug: topic,
  ...(context ? { scenarioContext: context } : {}),
});

export const assessmentQuestions: AssessmentQuestion[] = [
  question({
    id: "phishing-goal",
    topic: "introduction-to-phishing",
    difficulty: "Beginner",
    prompt:
      "Which description best explains the purpose of a phishing message?",
    answers: [
      "It attempts to influence someone to reveal information or take an action that benefits the sender.",
      "It is any message that contains a spelling mistake.",
      "It is a routine notice sent only by email.",
      "It is a message that can always be identified by its sender address.",
    ],
    correct: "a",
    explanation:
      "Phishing uses deception to prompt an action such as sharing information, sending money, approving access, or opening a file. It can arrive through many channels and may look polished.",
    objective: "Describe phishing and common attacker goals.",
  }),
  question({
    id: "phishing-verification",
    topic: "introduction-to-phishing",
    difficulty: "Intermediate",
    prompt:
      "A message you did not expect asks you to change payment details today. What is the safest first response?",
    answers: [
      "Use the contact details in the message to confirm quickly.",
      "Pause and verify the request through a separate contact method you already trust.",
      "Reply with a small amount of information to test the sender.",
      "Assume it is legitimate if the message uses your correct name.",
    ],
    correct: "b",
    explanation:
      "A separate trusted route avoids relying on the contact information supplied by the unverified request. Correct names or polished writing do not prove authenticity.",
    objective:
      "Choose an independent verification method for unexpected requests.",
    context: "The request involves payment changes and an urgent deadline.",
  }),
  question({
    id: "email-link-pressure",
    topic: "email-phishing",
    difficulty: "Beginner",
    prompt:
      "An email threatens to close your account in 20 minutes and includes a sign-in button. What is the strongest reason to pause?",
    answers: [
      "Emails cannot contain legitimate buttons.",
      "A short deadline may pressure you to use an unverified sign-in path.",
      "Any message about an account is definitely fraudulent.",
      "The button itself proves that the account is already compromised.",
    ],
    correct: "b",
    explanation:
      "Urgency can discourage careful checking. The message may be legitimate or deceptive, so verify through the service’s known app or address rather than the unsolicited button.",
    objective: "Recognize pressure and verify account requests independently.",
    context: "The email threatens account closure unless you sign in.",
  }),
  question({
    id: "email-sender-name",
    topic: "email-phishing",
    difficulty: "Intermediate",
    prompt:
      "A familiar colleague’s name appears in an email requesting a confidential file, but the address is unfamiliar. What should you do?",
    answers: [
      "Send the file because the display name matches.",
      "Reply to the same address and accept any answer as verification.",
      "Confirm with the colleague using a known internal contact method before sharing.",
      "Forward the file to another coworker to see if they recognize it.",
    ],
    correct: "c",
    explanation:
      "Display names can be chosen by the sender and do not authenticate an account. Verify a sensitive or unusual request using contact details from a trusted directory.",
    objective: "Assess sender identity and verify sensitive email requests.",
  }),
  question({
    id: "smishing-delivery",
    topic: "sms-phishing-smishing",
    difficulty: "Beginner",
    prompt:
      "An unexpected text says a parcel is held until you pay a small fee through a shortened link. What is the safest action?",
    answers: [
      "Open the link because the fee is small.",
      "Reply with your name so the sender can identify the parcel.",
      "Check orders through the retailer or carrier app or website you already use.",
      "Forward the link to friends to ask if it looks genuine.",
    ],
    correct: "c",
    explanation:
      "Unexpected delivery messages and shortened links can hide where they lead. Check tracking through a known route without using the text link.",
    objective:
      "Verify unexpected delivery texts without following their links.",
    context: "You are not expecting a parcel.",
  }),
  question({
    id: "smishing-short-link",
    topic: "sms-phishing-smishing",
    difficulty: "Intermediate",
    prompt:
      "Why can an unexpected shortened URL in a text deserve extra caution?",
    answers: [
      "Shortened URLs are always malicious.",
      "It obscures the destination, so the text alone does not show where it leads.",
      "It guarantees that the message came from an automated service.",
      "It proves that the recipient’s phone has malware.",
    ],
    correct: "b",
    explanation:
      "Short links are used legitimately too, but they make the destination harder to inspect. Verify the request independently instead of treating the short URL as proof either way.",
    objective:
      "Explain why hidden destinations merit verification without overclaiming.",
  }),
  question({
    id: "vishing-one-time-code",
    topic: "voice-phishing-vishing",
    difficulty: "Beginner",
    prompt:
      "A caller claiming to be support asks you to read out a one-time sign-in code. You did not contact support. What should you do?",
    answers: [
      "Share the code if the caller knows your name.",
      "Read half of the code and ask them to confirm the rest.",
      "End the call and contact support using a number or portal you already trust.",
      "Press the code into the phone keypad while the caller waits.",
    ],
    correct: "c",
    explanation:
      "A one-time code can authorize account access. Do not share it with an unsolicited caller; end the call and independently contact the organization.",
    objective: "Protect authentication codes during unsolicited calls.",
  }),
  question({
    id: "vishing-caller-id",
    topic: "voice-phishing-vishing",
    difficulty: "Intermediate",
    prompt:
      "A caller ID shows the name of your bank, but the caller urgently requests your password. Which statement is most accurate?",
    answers: [
      "Caller ID alone does not establish who is calling; do not share the password and call back using a trusted number.",
      "The caller ID proves the call is genuine.",
      "A password can be shared safely if the call is recorded.",
      "Ask the caller to repeat your account number before deciding.",
    ],
    correct: "a",
    explanation:
      "Caller ID may be misleading and should not be treated as authentication. Never disclose a password to a caller; contact the bank using a trusted number.",
    objective: "Verify voice callers independently and keep passwords private.",
  }),
  question({
    id: "spear-phishing-personalization",
    topic: "spear-phishing-and-targeted-attacks",
    difficulty: "Beginner",
    prompt:
      "What makes spear phishing different from a broadly sent phishing message?",
    answers: [
      "It is always delivered by phone.",
      "It is tailored to a particular person or group using relevant details.",
      "It cannot contain links or attachments.",
      "It is always sent from a compromised account.",
    ],
    correct: "b",
    explanation:
      "Spear phishing is targeted and may use personal or organizational context to appear credible. Personalization does not make an unusual request safe.",
    objective: "Identify the targeted nature of spear phishing.",
  }),
  question({
    id: "spear-phishing-executive",
    topic: "spear-phishing-and-targeted-attacks",
    difficulty: "Intermediate",
    prompt:
      "A message apparently from an executive asks you to send staff records privately before a meeting. What is the safest response?",
    answers: [
      "Send the records because the request came from a senior person.",
      "Verify the request with the executive through a separate known channel and follow data-sharing policy.",
      "Reply to the message asking whether it is genuine, then send the records if they say yes.",
      "Remove names from the file and send it immediately.",
    ],
    correct: "b",
    explanation:
      "Authority and secrecy can be used to discourage verification. Sensitive information should only be shared after confirming the request and following the organization’s process.",
    objective: "Verify targeted requests involving sensitive information.",
    context: "The request is unusual, private, and time-sensitive.",
  }),
  question({
    id: "domain-subdomain",
    topic: "fake-websites-and-domain-spoofing",
    difficulty: "Intermediate",
    prompt:
      "Which hostname should be examined most carefully as a possible impersonation?",
    answers: [
      "accounts.example.com",
      "example.com.accounts-login.example",
      "help.example.org",
      "store.example.net",
    ],
    correct: "b",
    explanation:
      "In `example.com.accounts-login.example`, the registered site is not established by the familiar-looking text at the beginning. Read the hostname from right to left and independently confirm the domain.",
    objective:
      "Distinguish a hostname’s ending domain from misleading preceding labels.",
  }),
  question({
    id: "domain-https",
    topic: "fake-websites-and-domain-spoofing",
    difficulty: "Beginner",
    prompt:
      "A sign-in page uses HTTPS. What does that fact establish by itself?",
    answers: [
      "The organization operating the site is legitimate.",
      "The page has no phishing content.",
      "The browser is using an encrypted connection to the named host, but HTTPS does not prove that the host is trustworthy.",
      "The page was reviewed by a government agency.",
    ],
    correct: "c",
    explanation:
      "HTTPS protects the connection to the host but does not validate the host’s identity as the service you intended. Check the domain and context separately.",
    objective: "Understand what HTTPS does and does not prove.",
  }),
  question({
    id: "attachment-enable",
    topic: "malicious-links-and-attachments",
    difficulty: "Beginner",
    prompt:
      "An unexpected spreadsheet asks you to enable macros to view an invoice. What should you do?",
    answers: [
      "Enable macros because the file contains an invoice.",
      "Do not enable content; verify the invoice with the sender using a trusted contact route and report it if unexpected.",
      "Forward the file to a coworker to see whether it opens.",
      "Rename the file and open it again.",
    ],
    correct: "b",
    explanation:
      "Unexpected attachments and requests to enable active content deserve caution. Do not execute or distribute the file; verify through an independent channel.",
    objective: "Handle unexpected files and active-content requests safely.",
  }),
  question({
    id: "attachment-preview",
    topic: "malicious-links-and-attachments",
    difficulty: "Intermediate",
    prompt:
      "You receive an unexpected archive attachment from an unfamiliar sender. Which response best limits risk?",
    answers: [
      "Open it in a previewer because previews can never be risky.",
      "Extract it on a personal device to see what it contains.",
      "Avoid opening or extracting it and use your organization’s reporting process.",
      "Upload it to any public file-sharing site for inspection.",
    ],
    correct: "c",
    explanation:
      "Opening or extracting unknown files can expose a device to risk, and uploading them elsewhere may disclose information. Use the organization’s established reporting and security process.",
    objective: "Avoid executing or distributing unexpected attachments.",
  }),
  question({
    id: "social-urgency",
    topic: "social-engineering",
    difficulty: "Beginner",
    prompt:
      "A caller says they are locked out and asks you to bypass the normal approval process because the request is urgent. What is the safest response?",
    answers: [
      "Follow the normal verification and approval process despite the pressure.",
      "Bypass approval if the caller sounds distressed.",
      "Share your account so the caller can finish the task.",
      "Keep the request secret to avoid delaying work.",
    ],
    correct: "a",
    explanation:
      "Social engineering can use urgency, authority, fear, or sympathy to influence a person. Keep normal safeguards in place and verify the request.",
    objective:
      "Recognize pressure as a social-engineering tactic and preserve safeguards.",
  }),
  question({
    id: "social-secrecy",
    topic: "social-engineering",
    difficulty: "Intermediate",
    prompt:
      "Which response best addresses a request that says, “Do not tell anyone; I need gift cards right now”?",
    answers: [
      "Buy the cards but wait to share their codes.",
      "Verify the request with the supposed requester using a known channel and follow the organization’s reporting process.",
      "Ask the sender to provide a more convincing story.",
      "Send one code first as a test.",
    ],
    correct: "b",
    explanation:
      "Secrecy, urgency, and an unusual payment method are warning signs. Do not send money or codes; verify independently and report the request.",
    objective: "Respond safely to secrecy and unusual payment requests.",
  }),
  question({
    id: "password-reuse",
    topic: "password-and-account-security",
    difficulty: "Beginner",
    prompt:
      "Why is using a different password for each important account safer?",
    answers: [
      "It guarantees that no account can be compromised.",
      "It limits the chance that a password exposed on one service can unlock other accounts.",
      "It makes phishing messages easier to identify.",
      "It removes the need for account recovery options.",
    ],
    correct: "b",
    explanation:
      "Unique passwords reduce the impact of a password exposed in a breach or phishing incident. A password manager can help manage distinct passwords.",
    objective: "Explain how unique passwords limit credential reuse risk.",
  }),
  question({
    id: "password-reset-request",
    topic: "password-and-account-security",
    difficulty: "Intermediate",
    prompt:
      "A message asks you to send your current password to “confirm your account.” What should you do?",
    answers: [
      "Send it if the message uses the correct company logo.",
      "Send it through a reply rather than a form.",
      "Do not disclose it; visit the service through its known app or address and report the message if suspicious.",
      "Change the password to a simpler one and send that instead.",
    ],
    correct: "c",
    explanation:
      "A legitimate service should not need you to disclose your current password in a message. Do not reply with it; access the service through a trusted route.",
    objective: "Keep passwords private and verify account messages safely.",
  }),
  question({
    id: "mfa-unexpected",
    topic: "multi-factor-authentication",
    difficulty: "Beginner",
    prompt:
      "An MFA approval prompt appears when you are not signing in. What should you do?",
    answers: [
      "Approve it to make the notification disappear.",
      "Reject it and report the unexpected request through a known support channel.",
      "Send the approval number to the person who contacted you.",
      "Disable MFA on every account.",
    ],
    correct: "b",
    explanation:
      "Approve only requests you initiated. An unexpected prompt may indicate someone is attempting to sign in; reject it and follow the service or organization’s account-security guidance.",
    objective: "Handle unrequested MFA prompts safely.",
  }),
  question({
    id: "mfa-code-request",
    topic: "multi-factor-authentication",
    difficulty: "Intermediate",
    prompt:
      "A support agent asks you to read out the code sent to your authenticator. What is the safest response?",
    answers: [
      "Share it if the agent knows your username.",
      "Share only if the agent says the code will expire soon.",
      "Do not share the code; end the interaction and contact support using a trusted route.",
      "Post it in a support chat so the whole team can see it.",
    ],
    correct: "c",
    explanation:
      "Authentication codes can authorize access and should not be shared with another person. Contact support independently if you need help.",
    objective: "Protect authentication codes from social engineering.",
  }),
  question({
    id: "safe-browsing-download",
    topic: "safe-browsing-habits",
    difficulty: "Beginner",
    prompt:
      "A pop-up says your device is infected and tells you to install a tool from its link. What should you do?",
    answers: [
      "Install the tool because the warning is displayed in a browser.",
      "Close the pop-up without following its link and use trusted security tools or support if concerned.",
      "Call the phone number shown in the pop-up.",
      "Enter account credentials to unlock the warning.",
    ],
    correct: "b",
    explanation:
      "A webpage can display alarming messages without having scanned your device. Do not install software or call numbers from an unexpected pop-up; use trusted tools and support.",
    objective: "Respond safely to alarming browser pop-ups.",
  }),
  question({
    id: "safe-browsing-public-wifi",
    topic: "safe-browsing-habits",
    difficulty: "Intermediate",
    prompt:
      "On public Wi-Fi, a sign-in page asks you to install an unfamiliar browser certificate to continue. What should you do?",
    answers: [
      "Install it because public Wi-Fi always requires certificates.",
      "Stop and verify the network instructions with the venue through a known channel; do not install an unexpected certificate.",
      "Enter your email password so the network can authenticate you.",
      "Disable all device security settings temporarily.",
    ],
    correct: "b",
    explanation:
      "An unexpected certificate can change how a device trusts connections. Do not install it based only on a captive page; verify through a trusted source.",
    objective:
      "Evaluate unexpected software or certificate requests while browsing.",
  }),
  question({
    id: "report-phishing",
    topic: "reporting-suspicious-activity",
    difficulty: "Beginner",
    prompt:
      "You receive a suspicious work email but have not clicked anything. What is a useful next step?",
    answers: [
      "Use your organization’s established reporting method and avoid forwarding it broadly.",
      "Reply to the sender to warn them.",
      "Post the full message publicly so others can decide.",
      "Delete it and assume no one else needs to know.",
    ],
    correct: "a",
    explanation:
      "Reporting through the approved channel can help the organization respond. Avoid interacting with the sender or exposing message contents unnecessarily.",
    objective: "Report suspicious messages using an appropriate channel.",
  }),
  question({
    id: "report-after-click",
    topic: "reporting-suspicious-activity",
    difficulty: "Intermediate",
    prompt:
      "You entered your password on a page that now seems suspicious. What should you do first?",
    answers: [
      "Wait to see whether anything unusual happens.",
      "Report the incident promptly and change the password through the service’s known official route; follow its recovery guidance.",
      "Reply to the page owner and ask them to delete the password.",
      "Reuse the same password elsewhere in case the account is locked.",
    ],
    correct: "b",
    explanation:
      "Prompt reporting can help contain risk. Use the known official route to change the exposed password, and follow the service or organization’s recovery steps. Do not reuse it.",
    objective: "Take practical steps after possible credential exposure.",
    context: "You are unsure whether the page was genuine.",
  }),
];

export const assessmentTopics = lessons.map((lesson) => ({
  slug: lesson.slug,
  title: lesson.title,
}));
