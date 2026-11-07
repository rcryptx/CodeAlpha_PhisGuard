export interface LearningReference {
  label: string;
  url: string;
}

export interface LessonSection {
  heading: string;
  paragraphs: string[];
  points?: string[];
}

export interface Lesson {
  slug: string;
  title: string;
  category: "Recognize" | "Understand" | "Protect" | "Respond";
  introduction: string;
  objectives: string[];
  explanations: LessonSection[];
  example: {
    label: string;
    text: string;
  };
  warningSigns: string[];
  prevention: string[];
  takeaways: string[];
  relatedLessons: string[];
  references: LearningReference[];
}

const phishingReference: LearningReference = {
  label: "CISA: Recognize and Report Phishing",
  url: "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing",
};

const ncscReference: LearningReference = {
  label: "UK NCSC: Phishing attacks",
  url: "https://www.ncsc.gov.uk/collection/phishing-scams",
};

const mfaReference: LearningReference = {
  label: "CISA: Turn on multifactor authentication",
  url: "https://www.cisa.gov/secure-our-world/turn-mfa",
};

const passwordReference: LearningReference = {
  label: "CISA: Use strong passwords",
  url: "https://www.cisa.gov/secure-our-world/use-strong-passwords",
};

const nistReference: LearningReference = {
  label: "NIST SP 800-63B: Authentication and authenticator management",
  url: "https://pages.nist.gov/800-63-4/sp800-63b.html",
};

export const lessons: Lesson[] = [
  {
    slug: "introduction-to-phishing",
    title: "Introduction to phishing",
    category: "Recognize",
    introduction:
      "Phishing is a deceptive attempt to get someone to reveal information, open a harmful file, send money, or take another action that benefits an attacker. Learning to pause and verify is more reliable than trying to spot every trick at a glance.",
    objectives: [
      "Explain what phishing is and what an attacker may be trying to achieve.",
      "Recognize pressure and deception as warning signs, not proof by themselves.",
      "Choose a safer way to verify an unexpected request.",
    ],
    explanations: [
      {
        heading: "How phishing works",
        paragraphs: [
          "A phisher pretends to be a person or organization the recipient might trust. The message may arrive by email, text, phone call, social media, or a messaging app.",
          "The goal is usually to influence a next step: share a password or payment detail, approve a sign-in, open an attachment, install software, or visit a deceptive website. The request can be simple or part of a longer conversation.",
        ],
      },
      {
        heading: "Why it can be convincing",
        paragraphs: [
          "Messages can use real names, familiar logos, current events, or details from public sources. Correct spelling and a polished design do not prove that a sender is genuine.",
          "No single clue confirms a message is malicious, and legitimate messages can also be unexpected or urgent. Consider the request and verify it through a separate, trusted channel.",
        ],
      },
    ],
    example: {
      label: "Illustrative example",
      text: "A message says a cloud account will be closed today unless the recipient signs in using a button in the message. Instead of using that button, the recipient opens the service’s known app or types its familiar address and checks for an account notice.",
    },
    warningSigns: [
      "A request for passwords, payment, personal data, or an approval you did not expect.",
      "Pressure to act immediately or keep the request secret.",
      "A link, attachment, or sign-in prompt that does not fit the situation.",
      "A sender or contact method that cannot be independently verified.",
    ],
    prevention: [
      "Pause before responding to an unexpected request, especially one involving access or money.",
      "Verify through a contact method you already trust, not the phone number or link in the message.",
      "Use multifactor authentication and unique passwords to limit the impact of a stolen password.",
      "Report suspicious messages using your organization’s process or the relevant service’s reporting option.",
    ],
    takeaways: [
      "Phishing can arrive through many communication channels.",
      "A warning sign is a reason to check, not automatic proof.",
      "Use a separate trusted route to verify an unexpected request.",
    ],
    relatedLessons: [
      "email-phishing",
      "social-engineering",
      "reporting-suspicious-activity",
    ],
    references: [phishingReference, ncscReference],
  },
  {
    slug: "email-phishing",
    title: "Email phishing",
    category: "Recognize",
    introduction:
      "Email phishing uses a message that appears to come from a trusted organization, colleague, or service. Focus on the action requested and verify the sender independently before sharing information or opening unexpected content.",
    objectives: [
      "Inspect the full sender address rather than relying on the display name.",
      "Recognize common email lures without depending on spelling mistakes.",
      "Verify an email request using a separate channel.",
    ],
    explanations: [
      {
        heading: "Check the request and sender together",
        paragraphs: [
          "A display name can be chosen by the sender and may imitate a familiar person. The full address and reply-to address can provide context, but an address that looks plausible is not proof of authenticity.",
          "Think about whether the message makes sense: were you expecting the invoice, password reset, shared document, or request to approve a transaction? A familiar topic can still be used to create a deceptive prompt.",
        ],
      },
      {
        heading: "Treat links and files cautiously",
        paragraphs: [
          "A link’s visible text may differ from its destination. On a computer, you can often preview a link without opening it; on a phone, avoid tapping if you cannot inspect it safely. Do not enter credentials on a page reached through an unexpected email.",
          "Unexpected attachments can exploit trust or curiosity. Follow your organization’s process for handling suspicious files rather than opening them to find out what they contain.",
        ],
      },
    ],
    example: {
      label: "Illustrative example",
      text: "An email appears to come from a department manager and asks for gift cards before a meeting. The employee contacts the manager using the company directory rather than replying to the email.",
    },
    warningSigns: [
      "An unexpected request to sign in, pay, share a file, or change account details.",
      "A sender address or reply-to address that does not match the known organization.",
      "A link or attachment that is unrelated to the conversation.",
      "A request to bypass normal approval or payment procedures.",
    ],
    prevention: [
      "Check the full sender address and the context of the request.",
      "Open a service through a known bookmark or its official app instead of an unexpected email link.",
      "Confirm financial or sensitive requests using a known phone number or internal channel.",
      "Use the email provider’s reporting option or follow your organization’s reporting process.",
    ],
    takeaways: [
      "A familiar name or polished email is not authentication.",
      "Verify sensitive requests outside the email thread.",
      "Do not open an unexpected file just to determine whether it is safe.",
    ],
    relatedLessons: [
      "introduction-to-phishing",
      "malicious-links-and-attachments",
      "reporting-suspicious-activity",
    ],
    references: [phishingReference, ncscReference],
  },
  {
    slug: "sms-phishing-smishing",
    title: "SMS phishing (smishing)",
    category: "Recognize",
    introduction:
      "Smishing is phishing delivered through SMS or a similar text-messaging channel. A short message can feel personal and immediate, so verify unexpected delivery, payment, account, and support requests before following a link or replying.",
    objectives: [
      "Describe how phishing can arrive through text messages.",
      "Identify suspicious requests commonly sent by SMS.",
      "Use a trusted app or contact method instead of a message link.",
    ],
    explanations: [
      {
        heading: "Why text messages need the same caution",
        paragraphs: [
          "A text may claim that a parcel is delayed, a toll is unpaid, an account is locked, or a payment needs attention. The sender may use a shortened link or a number that is unfamiliar.",
          "Messages can also appear in a conversation that contains legitimate texts. Do not assume a message is genuine only because the thread or sender name looks familiar.",
        ],
      },
      {
        heading: "Keep verification separate",
        paragraphs: [
          "If the message claims to be from a bank, delivery company, or public service, open the official app or use contact details from a trusted source. Do not use a phone number or link supplied only by the message.",
          "Avoid replying with personal information or a one-time sign-in code. If you have already followed a link or shared details, use the relevant service’s official security steps promptly.",
        ],
      },
    ],
    example: {
      label: "Illustrative example",
      text: "A text claims a parcel cannot be delivered until a small fee is paid through a link. The recipient checks the delivery status using the carrier’s official app and does not enter payment details on the linked page.",
    },
    warningSigns: [
      "An unexpected fee, delivery issue, account alert, or prize notification.",
      "A link that is shortened, misspelled, or unrelated to the claimed sender.",
      "A request for a password, payment card, or one-time verification code.",
      "Pressure to reply or act before checking through another route.",
    ],
    prevention: [
      "Do not use the message link to investigate an unexpected account or delivery alert.",
      "Open the official app or enter a known website address yourself.",
      "Do not share one-time codes; legitimate support should not ask you to disclose them.",
      "Report or block the message using your device or carrier’s available tools.",
    ],
    takeaways: [
      "Smishing is phishing sent by text.",
      "Verify the claim through the official service, not the provided link.",
      "Treat requests for sign-in codes as highly sensitive.",
    ],
    relatedLessons: [
      "introduction-to-phishing",
      "fake-websites-and-domain-spoofing",
      "malicious-links-and-attachments",
    ],
    references: [phishingReference, ncscReference],
  },
  {
    slug: "voice-phishing-vishing",
    title: "Voice phishing (vishing)",
    category: "Recognize",
    introduction:
      "Vishing is phishing carried out through phone or voice calls. A caller may use urgency, authority, or a familiar organization’s name to persuade someone to reveal information or approve an action.",
    objectives: [
      "Recognize common pressure tactics used in suspicious calls.",
      "Understand why caller ID does not independently verify identity.",
      "End a suspicious call and reconnect through a trusted number.",
    ],
    explanations: [
      {
        heading: "A convincing voice is not verification",
        paragraphs: [
          "A caller may claim to be from a bank, technical support, a government office, or the recipient’s workplace. Caller ID can be misleading, and a caller may know some real details about the person.",
          "The caller might ask for a password, a one-time code, remote access to a device, a payment, or an approval in an authentication app. These requests deserve particular caution when they are unexpected.",
        ],
      },
      {
        heading: "Take control of the callback",
        paragraphs: [
          "You do not need to stay on an unexpected call. End it, then contact the organization using a number from its official website, your bank card, or a trusted directory.",
          "If the caller claims there is an emergency, independently contact the person or organization they name. Do not rely on a number or transfer offered by the caller.",
        ],
      },
    ],
    example: {
      label: "Illustrative example",
      text: "A caller claiming to be technical support says a computer is infected and asks the user to install a remote-access tool. The user ends the call and contacts their organization’s support desk using its published internal number.",
    },
    warningSigns: [
      "Pressure to act immediately, keep the call secret, or avoid normal support channels.",
      "Requests for passwords, verification codes, remote access, or unexpected payment.",
      "A caller who discourages you from ending the call to verify independently.",
      "A claim that you must approve a sign-in you did not initiate.",
    ],
    prevention: [
      "End the call and dial a trusted number independently.",
      "Never disclose a password or one-time code to an unexpected caller.",
      "Do not install software or grant device access at an unsolicited caller’s direction.",
      "Report suspected impersonation to the claimed organization through its official channel.",
    ],
    takeaways: [
      "Caller ID and a confident voice do not prove who is calling.",
      "A callback using a trusted number breaks the caller’s control of the channel.",
      "Do not approve sign-ins or share codes you did not initiate.",
    ],
    relatedLessons: [
      "social-engineering",
      "multi-factor-authentication",
      "reporting-suspicious-activity",
    ],
    references: [phishingReference, ncscReference],
  },
  {
    slug: "spear-phishing-and-targeted-attacks",
    title: "Spear phishing and targeted attacks",
    category: "Understand",
    introduction:
      "Spear phishing is a targeted form of phishing tailored to a person or group. Personal details can make a message feel credible, but they do not prove that the sender or request is legitimate.",
    objectives: [
      "Distinguish a targeted phishing attempt from a generic lure.",
      "Understand how public or previously exposed details can be used to build trust.",
      "Apply verification and approval processes to tailored requests.",
    ],
    explanations: [
      {
        heading: "Personalization can be part of the deception",
        paragraphs: [
          "A targeted message may refer to a real project, role, colleague, event, or supplier. Information from public profiles or earlier communications can make a fake request sound plausible.",
          "Business email compromise is one related pattern: an attacker impersonates or takes over a business account to influence payments, payroll changes, or sensitive data sharing. A known display name alone cannot distinguish the two.",
        ],
      },
      {
        heading: "Keep process stronger than pressure",
        paragraphs: [
          "Use established approval steps even when a request appears to come from a senior person or familiar partner. A genuine request should withstand a brief, independent confirmation.",
          "Limit personal and organizational details shared publicly where practical, and use strong account protections to reduce the risk of account takeover.",
        ],
      },
    ],
    example: {
      label: "Illustrative example",
      text: "A message references a real project and asks an employee to send a customer list to a new address. The employee checks the request with the colleague using the organization’s normal internal channel and follows data-sharing rules.",
    },
    warningSigns: [
      "A tailored but unexpected request for confidential files, payment, or account changes.",
      "A request to bypass ordinary review, approval, or verification.",
      "Subtle changes in a known contact’s email address or payment details.",
      "Urgency or secrecy used to prevent a second person from checking.",
    ],
    prevention: [
      "Confirm sensitive requests with the person using a separate known channel.",
      "Use a second approver for financial or high-impact account changes.",
      "Follow established processes even when a request appears senior or urgent.",
      "Use unique passwords and multifactor authentication on important accounts.",
    ],
    takeaways: [
      "Personal details can be gathered and reused to make a lure convincing.",
      "Tailored messages still require independent verification.",
      "Consistent approval procedures help resist urgency and impersonation.",
    ],
    relatedLessons: [
      "social-engineering",
      "email-phishing",
      "password-and-account-security",
    ],
    references: [phishingReference, ncscReference],
  },
  {
    slug: "fake-websites-and-domain-spoofing",
    title: "Fake websites and domain spoofing",
    category: "Recognize",
    introduction:
      "A deceptive website can imitate a real service to collect credentials, payment details, or personal information. Before signing in, check how you reached the page and carefully inspect the domain.",
    objectives: [
      "Identify the registered domain within a web address.",
      "Recognize that HTTPS does not prove a site is trustworthy.",
      "Reach important services through a known, trusted route.",
    ],
    explanations: [
      {
        heading: "Read the domain from right to left",
        paragraphs: [
          "In a web address, the registered domain is generally the part directly before the top-level domain, such as “example” in “accounts.example.com”. Extra words before the domain can be subdomains; words after a slash are paths and do not change who controls the domain.",
          "Lookalike domains may swap characters, add words, use a different ending, or place a brand name inside a longer domain controlled by someone else. The full address matters more than a logo or page design.",
        ],
      },
      {
        heading: "What the lock icon does and does not mean",
        paragraphs: [
          "HTTPS encrypts the connection between your browser and the site. It does not certify that the site belongs to the company it claims to represent or that the site is safe to use.",
          "If a page reached from an unexpected message asks you to sign in, close it and open the service from a known bookmark, official app, or address you type yourself.",
        ],
      },
    ],
    example: {
      label: "Illustrative example",
      text: "A link contains a company name in a long address, but the registered domain belongs to an unrelated site. The user does not sign in and instead navigates to the company’s known website directly.",
    },
    warningSigns: [
      "A domain with a subtle spelling change or an unexpected ending.",
      "A brand name appearing only in a subdomain or in the path after the domain.",
      "A sign-in page reached through an unexpected email, text, or advertisement.",
      "A site that asks for information unrelated to the service or task.",
    ],
    prevention: [
      "Use a bookmark or official app for banking, email, and other sensitive services.",
      "Read the complete domain before entering a password or payment detail.",
      "Do not treat HTTPS or a lock icon as proof of the site’s identity.",
      "Use a password manager where available; it can help avoid entering credentials on a different domain.",
    ],
    takeaways: [
      "The registered domain identifies the site operator more than the page design does.",
      "HTTPS protects a connection but does not establish a site’s legitimacy.",
      "Reach sensitive services through a known route.",
    ],
    relatedLessons: [
      "malicious-links-and-attachments",
      "sms-phishing-smishing",
      "password-and-account-security",
    ],
    references: [phishingReference, ncscReference],
  },
  {
    slug: "malicious-links-and-attachments",
    title: "Malicious links and attachments",
    category: "Recognize",
    introduction:
      "Links and attachments can lead to deceptive sign-in pages, unwanted downloads, or harmful files. Treat unexpected content cautiously and use a known destination or your organization’s security process instead of opening it to investigate.",
    objectives: [
      "Recognize how links and files can be used in phishing.",
      "Understand the limits of link previews and security scans.",
      "Choose a safer response to unexpected content.",
    ],
    explanations: [
      {
        heading: "A link can hide its destination",
        paragraphs: [
          "Visible link text may not match the address it opens. Link shorteners can also conceal the final destination. A preview can be useful on some devices, but it is not a guarantee that a destination is safe.",
          "A familiar-looking site can still be deceptive. Avoid entering credentials or approving access just because a page resembles a service you use.",
        ],
      },
      {
        heading: "Attachments can prompt risky actions",
        paragraphs: [
          "An attachment may ask you to enable macros, install a viewer, enter a password, or open a file from an unexpected source. Those steps can expose data or compromise a device.",
          "Security tools can reduce risk but do not guarantee that every harmful file or link will be detected. Follow your organization’s process for reporting or checking suspicious content.",
        ],
      },
    ],
    example: {
      label: "Illustrative example",
      text: "An unexpected document says that its contents are hidden until the reader enables active content. The recipient does not enable it and reports the message through the organization’s security process.",
    },
    warningSigns: [
      "Unexpected files, shared documents, or password-protected archives.",
      "A request to enable macros, install software, or bypass a browser warning.",
      "A link that redirects unexpectedly or asks for sign-in details.",
      "A sender who pressures you to open content quickly.",
    ],
    prevention: [
      "Confirm that the sender intended to share the file or link through a separate channel.",
      "Do not bypass security warnings or enable active content to view an unexpected file.",
      "Use organization-approved tools to report or inspect suspicious attachments.",
      "If you opened a suspicious file, contact your organization’s support team promptly and explain what happened.",
    ],
    takeaways: [
      "A preview or security scan is not a guarantee.",
      "Unexpected files and sign-in prompts deserve independent checks.",
      "Report quickly if you opened something suspicious.",
    ],
    relatedLessons: [
      "email-phishing",
      "fake-websites-and-domain-spoofing",
      "reporting-suspicious-activity",
    ],
    references: [phishingReference, ncscReference],
  },
  {
    slug: "social-engineering",
    title: "Social engineering techniques",
    category: "Understand",
    introduction:
      "Social engineering uses influence and deception to make someone take an action or share information. Understanding the tactic helps you slow down, but no particular emotion or message style alone proves an attack.",
    objectives: [
      "Recognize common influence tactics used in deceptive requests.",
      "Separate the urgency of a message from evidence that it is genuine.",
      "Use a pause-and-verify response without feeling pressured to comply.",
    ],
    explanations: [
      {
        heading: "Common pressure patterns",
        paragraphs: [
          "A request may invoke authority (“the director needs this”), urgency (“before the account closes”), fear (“your device is infected”), curiosity (“see the confidential file”), or a reward (“claim your prize”). These are examples of tactics, not a checklist that can identify every scam.",
          "Attackers may also build rapport or start with harmless questions before making a consequential request. A conversation that feels friendly can still require normal verification.",
        ],
      },
      {
        heading: "Use a deliberate pause",
        paragraphs: [
          "A reliable response is to pause, identify what the person wants you to do, and verify through an independent channel. For work requests, follow your team’s standard approval and reporting processes.",
          "You can decline to share a code, password, or payment until the request is verified. Legitimate organizations should allow reasonable checks for sensitive actions.",
        ],
      },
    ],
    example: {
      label: "Illustrative example",
      text: "A caller says a manager is in a meeting and asks an employee to urgently change a supplier’s bank details. The employee follows the normal change-control process and confirms with the manager using a known contact method.",
    },
    warningSigns: [
      "Urgency, secrecy, fear, or authority used to discourage a check.",
      "A request to break a normal process or avoid involving another person.",
      "An unexpected request for credentials, codes, money, or confidential data.",
      "A conversation that changes direction toward a sensitive action.",
    ],
    prevention: [
      "Name the requested action and consider what could happen if it is wrong.",
      "Take time to verify; do not let an unusual deadline replace evidence.",
      "Use established approval, payment, and identity-check procedures.",
      "Ask a trusted colleague or contact through a separate channel when uncertain.",
    ],
    takeaways: [
      "Influence tactics can be subtle and may appear in any communication channel.",
      "A pause and independent verification can interrupt the pressure.",
      "Following normal procedures is appropriate even when someone sounds authoritative.",
    ],
    relatedLessons: [
      "spear-phishing-and-targeted-attacks",
      "voice-phishing-vishing",
      "reporting-suspicious-activity",
    ],
    references: [phishingReference, ncscReference],
  },
  {
    slug: "password-and-account-security",
    title: "Password and account security",
    category: "Protect",
    introduction:
      "Strong account habits reduce the damage a stolen or guessed password can cause. Use unique passwords, protect recovery methods, and secure important accounts with multifactor authentication when available.",
    objectives: [
      "Explain why reusing passwords creates risk across accounts.",
      "Choose practical ways to create and store unique passwords.",
      "Know what to do if you suspect an account password was exposed.",
    ],
    explanations: [
      {
        heading: "Make passwords unique",
        paragraphs: [
          "If one service is breached and a password is reused elsewhere, another account may be at risk. A long, unique password or passphrase for each account limits this reuse problem.",
          "A reputable password manager can generate and remember unique passwords. Protect the manager account with a strong password and multifactor authentication where supported.",
        ],
      },
      {
        heading: "Protect recovery and sign-in options",
        paragraphs: [
          "Recovery email addresses, phone numbers, security keys, and authentication apps are part of account security. Keep recovery options current and do not share sign-in codes with someone who contacts you unexpectedly.",
          "If you believe a password was exposed, change it through the service’s official app or website, change any reused passwords, review active sessions and recovery settings, and contact the provider if you cannot regain control.",
        ],
      },
    ],
    example: {
      label: "Illustrative example",
      text: "After receiving an unexpected sign-in alert, a user opens the service’s official app, changes the account’s unique password, reviews active sessions, and checks that recovery details are still theirs.",
    },
    warningSigns: [
      "A sign-in alert you do not recognize or a password reset you did not request.",
      "A request to disclose your password or forward a sign-in code.",
      "Unexpected changes to recovery details or active sessions.",
      "The same password being used for email and other important accounts.",
    ],
    prevention: [
      "Use a different, strong password for each account.",
      "Consider a password manager to create and store unique passwords.",
      "Enable multifactor authentication, especially on email and financial accounts.",
      "Review recovery information and active sessions after a suspected compromise.",
    ],
    takeaways: [
      "Password reuse can let one exposed credential affect other services.",
      "A password manager can make unique passwords easier to maintain.",
      "Use official account settings to respond to suspected exposure.",
    ],
    relatedLessons: [
      "multi-factor-authentication",
      "fake-websites-and-domain-spoofing",
      "introduction-to-phishing",
    ],
    references: [passwordReference, nistReference],
  },
  {
    slug: "multi-factor-authentication",
    title: "Multi-factor authentication",
    category: "Protect",
    introduction:
      "Multifactor authentication (MFA) adds another sign-in check beyond a password. It can reduce the risk of account takeover, but unexpected prompts and requests for codes still need careful attention.",
    objectives: [
      "Explain how MFA adds a layer to account sign-in.",
      "Recognize unexpected authentication prompts as a warning.",
      "Choose an MFA option offered by a service and appropriate to your needs.",
    ],
    explanations: [
      {
        heading: "What counts as another factor",
        paragraphs: [
          "A service may ask for something you have, such as an authenticator app or security key, or something you are, such as a biometric check. The exact options vary by service and account.",
          "MFA is not a reason to approve every prompt. If you did not start a sign-in, deny or ignore the request and review the account using its official app or website.",
        ],
      },
      {
        heading: "Protect codes and approvals",
        paragraphs: [
          "A one-time code or push approval can help complete a sign-in. Someone who persuades you to share or approve it may be trying to access your account.",
          "Where available, consider phishing-resistant sign-in options such as passkeys or security keys. Follow the service’s guidance for setup and recovery.",
        ],
      },
    ],
    example: {
      label: "Illustrative example",
      text: "A user receives several sign-in approval requests while not trying to log in. They deny the requests, do not share a code with the caller claiming to be support, and check the account through its official site.",
    },
    warningSigns: [
      "An MFA prompt you did not initiate.",
      "A caller or message asking you to read out a one-time code.",
      "Repeated prompts intended to make you approve one to stop the interruptions.",
      "A sign-in notification from an unfamiliar device or location.",
    ],
    prevention: [
      "Enable MFA for important accounts when it is offered.",
      "Never approve a prompt or share a code for a sign-in you did not start.",
      "Consider a security key or passkey where supported and suitable.",
      "If you receive an unexpected prompt, deny it and review the account through a trusted route.",
    ],
    takeaways: [
      "MFA adds protection but does not eliminate phishing risk.",
      "Only approve a sign-in that you initiated and recognize.",
      "Never disclose one-time codes to unexpected contacts.",
    ],
    relatedLessons: [
      "password-and-account-security",
      "voice-phishing-vishing",
      "reporting-suspicious-activity",
    ],
    references: [mfaReference, nistReference],
  },
  {
    slug: "safe-browsing-habits",
    title: "Safe browsing habits",
    category: "Protect",
    introduction:
      "Safer browsing comes from a set of repeatable habits: use trusted routes to important services, keep software updated, and pause when a page asks for an unexpected download, sign-in, or permission.",
    objectives: [
      "Use safer routes to access sensitive online accounts.",
      "Understand why browser warnings and software updates matter.",
      "Avoid treating any single browser indicator as a guarantee.",
    ],
    explanations: [
      {
        heading: "Start from a trusted place",
        paragraphs: [
          "Use bookmarks, official apps, or addresses you already know for important services. Be careful with search ads and unsolicited links when you need to reach a sign-in page.",
          "A lock icon or HTTPS indicates an encrypted connection, not that the site is genuine. Check the domain and the context before entering sensitive information.",
        ],
      },
      {
        heading: "Keep the browser and device maintained",
        paragraphs: [
          "Install browser and operating-system updates through their built-in update mechanisms. Updates can include security fixes, so avoid delaying them unnecessarily.",
          "Do not install extensions, apps, or certificates at the direction of an unexpected website or caller. Review permissions and use trusted sources for software.",
        ],
      },
    ],
    example: {
      label: "Illustrative example",
      text: "A search result for a financial service appears above the service’s usual result. The user uses a saved bookmark instead of choosing an unfamiliar result and checks the address before signing in.",
    },
    warningSigns: [
      "A browser warning that a page or download may be unsafe.",
      "A page asking you to install software, an extension, or a certificate unexpectedly.",
      "A sign-in prompt on a domain that differs from the service you intended to visit.",
      "A download or permission request that is unrelated to your task.",
    ],
    prevention: [
      "Use bookmarks or official apps for sensitive services.",
      "Keep your browser and operating system updated.",
      "Do not bypass browser warnings or install unexpected software.",
      "Check a site’s domain and request context before sharing information.",
    ],
    takeaways: [
      "Trusted routes help reduce exposure to lookalike pages.",
      "HTTPS does not establish that a website is legitimate.",
      "Keep software updated and avoid unexpected downloads or permissions.",
    ],
    relatedLessons: [
      "fake-websites-and-domain-spoofing",
      "malicious-links-and-attachments",
      "password-and-account-security",
    ],
    references: [phishingReference, ncscReference],
  },
  {
    slug: "reporting-suspicious-activity",
    title: "Reporting suspicious activity",
    category: "Respond",
    introduction:
      "Reporting a suspicious message or account event helps the relevant service or security team investigate. If you already clicked a link or shared information, report that too and take action through trusted channels.",
    objectives: [
      "Know what information is useful when reporting a suspicious message.",
      "Choose an appropriate reporting channel.",
      "Take immediate steps after a possible accidental disclosure.",
    ],
    explanations: [
      {
        heading: "Report through a trusted route",
        paragraphs: [
          "Use your organization’s reporting button or contact its IT or security team through the directory. For personal accounts, use the service’s official reporting and support pages.",
          "Keep the original message when your organization asks for it, but do not forward suspicious links or files to other people without following the reporting process. Include what happened and when, especially if you interacted with the message.",
        ],
      },
      {
        heading: "If you already took an action",
        paragraphs: [
          "Tell the relevant support or security team promptly if you opened an attachment, entered a password, sent money, or approved a sign-in. Do not hide a mistake; quick reporting can help limit harm.",
          "For an exposed password, change it using the official service and change it anywhere else it was reused. For payment issues, contact the bank or payment provider using a trusted number. Follow incident-specific guidance from the organization or provider.",
        ],
      },
    ],
    example: {
      label: "Illustrative example",
      text: "An employee realizes they entered a work password on a page reached from an unexpected message. They report the event to the security team immediately, then follow its instructions for changing the password and reviewing sessions.",
    },
    warningSigns: [
      "An unexpected message asking for credentials, payment, or a sensitive action.",
      "A sign-in, MFA, or account-change alert you do not recognize.",
      "A suspicious link or file that you or someone else already opened.",
      "A request to keep a possible security incident secret.",
    ],
    prevention: [
      "Use your organization’s official report mechanism or the service’s trusted support page.",
      "Include whether you clicked, opened, replied, paid, or shared information.",
      "Contact a bank or payment provider using a known number if money may be at risk.",
      "Follow the instructions of your organization’s security team or the affected service.",
    ],
    takeaways: [
      "Report promptly, even if you are unsure or already interacted with the message.",
      "Use a trusted reporting route rather than replying to the suspicious sender.",
      "The next steps depend on what information or access may be exposed.",
    ],
    relatedLessons: [
      "introduction-to-phishing",
      "email-phishing",
      "password-and-account-security",
    ],
    references: [phishingReference, ncscReference],
  },
];

export const lessonCategories = [
  {
    name: "Recognize",
    description: "Learn to spot suspicious messages, websites, and requests.",
  },
  {
    name: "Understand",
    description:
      "Explore how targeting and persuasion can shape a phishing attempt.",
  },
  {
    name: "Protect",
    description: "Build account and browsing habits that reduce risk.",
  },
  {
    name: "Respond",
    description: "Know where and how to report concerns.",
  },
] as const;

export const lessonBySlug = (slug: string) =>
  lessons.find((lesson) => lesson.slug === slug);

export const getLessonIndex = (slug: string) =>
  lessons.findIndex((lesson) => lesson.slug === slug);

export const getRelatedLessons = (lesson: Lesson) =>
  lesson.relatedLessons
    .map((slug) => lessonBySlug(slug))
    .filter((related): related is Lesson => Boolean(related));
