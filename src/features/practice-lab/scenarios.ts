import type { PracticeScenario } from "./types";

export const practiceScenarios: PracticeScenario[] = [
  {
    id: "urgent-account-check",
    title: "An urgent account check",
    category: "Email phishing",
    difficulty: "Beginner",
    sender: "Northstar Notes account team",
    channel: "Email",
    scenarioText:
      "A message says your Northstar Notes account will be paused in 30 minutes unless you verify it. It asks you to sign in using a button labeled “Keep my account.” The displayed address is accounts.northstarnotes.example.",
    decisions: [
      { id: "use-email-button", label: "Use the button before the deadline." },
      {
        id: "verify-independently",
        label:
          "Do not use the button; open the service using its saved app or known address and check for a notice.",
      },
      {
        id: "reply-for-details",
        label: "Reply to the sender and ask whether the message is genuine.",
      },
    ],
    correctDecisionId: "verify-independently",
    technique: "Urgency paired with a request to verify an account.",
    explanation:
      "A short deadline pressures you to act before checking the request. The sender name and displayed address do not prove who sent the message, and the sign-in button could lead somewhere other than the real service.",
    warningSigns: [
      "A threat of account interruption with a short deadline.",
      "A sign-in request reached through an unsolicited email button.",
      "The sender identity has not been independently verified.",
    ],
    possibleConsequence:
      "Entering a password on an imitation page could give it to someone else, who may then try it on the real service.",
    recommendedResponse:
      "Leave the button untouched. Open Northstar Notes from a saved bookmark or its official app, check account notices there, and report the email using your normal reporting process if it is unexpected.",
    takeaway:
      "When a message creates urgency, verify the request through a separate route you already trust.",
    lessonSlug: "email-phishing",
  },
  {
    id: "parcel-fee-text",
    title: "A parcel fee by text",
    category: "Smishing",
    difficulty: "Beginner",
    sender: "Harbor Parcel delivery desk",
    channel: "SMS",
    scenarioText:
      "A text says a parcel could not be delivered and a small re-delivery fee is due today. It says to use the shortened address hbr.example/r7K2. You are not expecting a delivery.",
    decisions: [
      {
        id: "open-short-link",
        label: "Open the shortened address to see which parcel it means.",
      },
      {
        id: "check-official-tracking",
        label:
          "Do not use the text link; check orders and tracking from the retailer or carrier’s known app or website.",
      },
      {
        id: "pay-fee-by-reply",
        label: "Reply with your name and payment details to resolve the fee.",
      },
    ],
    correctDecisionId: "check-official-tracking",
    technique:
      "Smishing that uses a delivery problem and a small fee to prompt action.",
    explanation:
      "The unexpected delivery problem, same-day pressure, and shortened link make the request hard to verify from the message alone. A small fee can still be used to collect payment or personal details.",
    warningSigns: [
      "You are not expecting a delivery.",
      "The message asks for quick payment.",
      "A shortened address hides the destination.",
    ],
    possibleConsequence:
      "The link could lead to a page that collects payment details or personal information.",
    recommendedResponse:
      "Do not open or reply to the text. Check any real order through the retailer or carrier app you already use; report or delete the message according to your mobile provider’s or organization’s guidance.",
    takeaway:
      "Verify delivery problems through a known tracking channel, not through an unexpected text link.",
    lessonSlug: "sms-phishing-smishing",
  },
  {
    id: "unexpected-spreadsheet",
    title: "An unexpected spreadsheet",
    category: "Malicious attachments",
    difficulty: "Beginner",
    sender: "Mira, listed as a supplier contact",
    channel: "Email attachment",
    scenarioText:
      "An email with the subject “Updated payment details” includes an attachment named Payment_Update.xlsm. The message says to enable its content so you can view the new details. You were not expecting a payment update.",
    decisions: [
      {
        id: "enable-content",
        label: "Open it and enable the requested content to view the details.",
      },
      {
        id: "verify-supplier",
        label:
          "Do not open it; contact the supplier using the contact details already on file and report the unexpected attachment.",
      },
      {
        id: "forward-attachment",
        label: "Forward the file to a coworker to ask them to test it.",
      },
    ],
    correctDecisionId: "verify-supplier",
    technique:
      "Unexpected attachment using a business change and a request to enable active content.",
    explanation:
      "The attachment is unexpected and asks you to enable content. That can allow active document features to run. The sender display name alone cannot confirm the sender’s identity.",
    warningSigns: [
      "A payment change arrives without prior context.",
      "The file type supports active content.",
      "The message asks you to enable content before viewing it.",
    ],
    possibleConsequence:
      "Enabling active content in an untrusted file could run unwanted actions or expose information on the device.",
    recommendedResponse:
      "Do not open or forward the attachment. Verify the payment change through supplier contact details already on file, then use your organization’s established process to report the email.",
    takeaway:
      "Treat unexpected files and requests to enable active content as untrusted until verified separately.",
    lessonSlug: "malicious-links-and-attachments",
  },
  {
    id: "director-data-request",
    title: "A request from the director",
    category: "Impersonation",
    difficulty: "Intermediate",
    sender: "“Leena Shah, Operations Director”",
    channel: "Work email",
    scenarioText:
      "A message from an unfamiliar address says the director is in a meeting and needs the staff roster and a summary of pending payments immediately. It asks you to keep the request private until the meeting ends.",
    decisions: [
      {
        id: "send-files",
        label: "Send the files now because the sender appears senior.",
      },
      {
        id: "verify-manager",
        label:
          "Do not send information; verify the request with the director through your organization’s known directory or a separate trusted channel.",
      },
      {
        id: "reply-to-address",
        label: "Reply to the unfamiliar address asking for confirmation.",
      },
    ],
    correctDecisionId: "verify-manager",
    technique: "Impersonation combined with authority, urgency, and secrecy.",
    explanation:
      "A familiar name can be copied into an email display field. The request asks for sensitive information, creates urgency, and discourages normal verification—three reasons to pause.",
    warningSigns: [
      "The sender address is unfamiliar.",
      "The request involves staff and payment information.",
      "The message asks for secrecy and immediate action.",
    ],
    possibleConsequence:
      "Sharing the files could expose personal or business information to an unauthorized person.",
    recommendedResponse:
      "Do not reply to the unfamiliar address or send files. Confirm the request using a known internal directory or a separate channel, and report it through the organization’s normal process.",
    takeaway:
      "Verify unusual sensitive requests independently, even when they appear to come from someone senior.",
    lessonSlug: "spear-phishing-and-targeted-attacks",
  },
  {
    id: "too-good-internship",
    title: "A fast-track internship offer",
    category: "Fake opportunities",
    difficulty: "Beginner",
    sender: "Brightpath Studio recruitment",
    channel: "Direct message",
    scenarioText:
      "A recruiter offers a remote internship without an interview and promises unusually high pay. To “reserve the place,” they ask you to send an identity document and pay a refundable equipment deposit today through a personal payment account.",
    decisions: [
      {
        id: "send-documents-fee",
        label: "Send the document and deposit to secure the opportunity.",
      },
      {
        id: "verify-employer",
        label:
          "Do not send documents or money; research the employer independently and verify the opening through its official careers channel.",
      },
      {
        id: "share-limited-details",
        label:
          "Send only basic personal details and ask for the contract afterward.",
      },
    ],
    correctDecisionId: "verify-employer",
    technique:
      "A high-reward opportunity used to collect money and identity information.",
    explanation:
      "The offer skips ordinary hiring steps and asks for money and identity documents under time pressure. Those requests are not made safer by a promise that a deposit is refundable.",
    warningSigns: [
      "An offer without a meaningful interview or verification.",
      "Pay that seems unusually high for the described role.",
      "A fee and identity documents requested through a personal channel.",
    ],
    possibleConsequence:
      "A payment may not be returned, and identity documents could be misused.",
    recommendedResponse:
      "Do not send money or identity documents. Find the organization independently and confirm the role through its official careers page or a verified contact.",
    takeaway:
      "A legitimate-looking opportunity should withstand independent checks and should not require rushed personal payments.",
    lessonSlug: "social-engineering",
  },
  {
    id: "repeated-login-prompts",
    title: "Authentication prompts keep appearing",
    category: "MFA fatigue",
    difficulty: "Intermediate",
    sender: "Account sign-in approval prompt",
    channel: "Multi-factor authentication app",
    scenarioText:
      "Several sign-in approval prompts arrive while you are not trying to log in. A message then appears from an unknown number saying, “Approve one so we can stop the alerts.”",
    decisions: [
      {
        id: "approve-prompt",
        label: "Approve one prompt to make the repeated alerts stop.",
      },
      {
        id: "reject-and-report",
        label:
          "Reject the prompts; report the unexpected requests through your organization’s known support channel and secure the account.",
      },
      {
        id: "share-code",
        label:
          "Send the unknown person a screenshot so they can identify the issue.",
      },
    ],
    correctDecisionId: "reject-and-report",
    technique:
      "MFA fatigue: repeated approval requests intended to wear down a user.",
    explanation:
      "An approval prompt should match a sign-in you initiated. Repeated prompts can be an attempt to get one accidental approval, and the unknown message adds pressure rather than verifying the activity.",
    warningSigns: [
      "Approval requests appear when you are not signing in.",
      "The requests repeat.",
      "An unknown person asks you to approve one or share account information.",
    ],
    possibleConsequence:
      "Approving an unrequested sign-in may allow someone else to access the account.",
    recommendedResponse:
      "Reject every unrequested prompt. Report the activity through a known support channel, change the account password from the official service if advised, and review active sessions.",
    takeaway:
      "Approve only authentication requests you initiated; reject and report unexpected prompts.",
    lessonSlug: "multi-factor-authentication",
  },
  {
    id: "fake-helpdesk-call",
    title: "A support call about your computer",
    category: "Tech support scams",
    difficulty: "Intermediate",
    sender: "Caller claiming to be the Westbridge Help Desk",
    channel: "Phone call",
    scenarioText:
      "The caller says they detected a problem with your work computer and must fix it immediately. They ask you to install a remote support tool and read out a one-time sign-in code. You did not contact support.",
    decisions: [
      {
        id: "install-and-share",
        label: "Install the tool and share the code so the caller can help.",
      },
      {
        id: "end-and-contact",
        label:
          "End the call without sharing a code; contact support using the number or help portal already provided by your organization.",
      },
      {
        id: "keep-caller-on-line",
        label:
          "Keep the caller on the line while you search for the tool they named.",
      },
    ],
    correctDecisionId: "end-and-contact",
    technique:
      "Unsolicited technical-support impersonation using urgency and remote access.",
    explanation:
      "The caller initiated contact, claims an emergency, and requests remote access and a one-time code. Those actions could give the caller control over a device or account.",
    warningSigns: [
      "You did not request support.",
      "The caller creates urgency about a technical problem.",
      "They ask for remote access and a one-time code.",
    ],
    possibleConsequence:
      "Remote access or a shared code could expose files, accounts, or work systems.",
    recommendedResponse:
      "End the call. Do not install anything or share a code. Reach support using contact information from a known internal directory or help portal, and report the call.",
    takeaway:
      "A support identity should be verified through a contact route you already trust before granting access.",
    lessonSlug: "voice-phishing-vishing",
  },
  {
    id: "lobby-qr-notice",
    title: "A QR code on a lobby notice",
    category: "QR-code links",
    difficulty: "Beginner",
    sender: "Printed “visitor Wi-Fi update” notice",
    channel: "QR code",
    scenarioText:
      "A new notice in a shared lobby says the visitor Wi-Fi password has changed and asks people to scan a QR code to sign in. The printed destination shown beneath the code is wifi-access.example/guest. Building staff have not mentioned a change.",
    decisions: [
      {
        id: "scan-and-sign-in",
        label:
          "Scan the code and enter your usual account password if requested.",
      },
      {
        id: "confirm-with-staff",
        label:
          "Do not scan it or enter credentials; confirm the Wi-Fi details with building staff using a known contact method.",
      },
      {
        id: "share-qr-photo",
        label: "Take a photo and send it to the person who posted the notice.",
      },
    ],
    correctDecisionId: "confirm-with-staff",
    technique:
      "A physical notice uses a QR code to hide a destination and solicit sign-in.",
    explanation:
      "A QR code can lead to any destination, and the printed label does not prove who placed the notice. The unannounced change and request to sign in with a usual password deserve independent confirmation.",
    warningSigns: [
      "The notice announces an unverified change in a shared space.",
      "The QR code obscures the destination until scanned.",
      "A Wi-Fi update asks for a usual account password.",
    ],
    possibleConsequence:
      "A lookalike sign-in page could collect the password or other information.",
    recommendedResponse:
      "Do not scan the code or enter credentials. Ask building staff through a known contact method and use the established guest network instructions.",
    takeaway:
      "Treat QR codes like links: check the context and verify unexpected requests through a known channel.",
    lessonSlug: "fake-websites-and-domain-spoofing",
  },
];
