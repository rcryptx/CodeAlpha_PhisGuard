import type { GlossaryTerm } from "./types";

/**
 * Curated cybersecurity glossary.
 *
 * Wording follows widely accepted definitions from established references
 * (NIST CSRC glossary, CISA, UK NCSC, OWASP, and IETF RFCs). This content is
 * bundled locally and never fetched at runtime. `relatedTerms` reference other
 * term ids in this file, and `lessonSlugs` reference lessons in
 * `src/features/learning/curriculum.ts`.
 */
export const glossaryTerms: GlossaryTerm[] = [
  // Phishing
  {
    id: "phishing",
    term: "Phishing",
    definition:
      "A deceptive attempt, usually delivered by message, to trick someone into revealing information, opening harmful content, sending money, or approving an action.",
    explanation:
      "Phishing pretends to come from a person or organisation you trust, and often pushes you to act quickly. It can arrive by email, text, phone call, or social media.",
    example:
      "An email that looks like it is from your bank asks you to confirm your password through a link, but the link leads to a lookalike website.",
    category: "Phishing",
    difficulty: "Beginner",
    keywords: ["phishing", "scam", "credential theft", "deception"],
    relatedTerms: [
      "spear-phishing",
      "smishing",
      "vishing",
      "social-engineering",
      "credential-harvesting",
    ],
    lessonSlugs: ["introduction-to-phishing", "email-phishing"],
  },
  {
    id: "spear-phishing",
    term: "Spear phishing",
    definition:
      "A targeted phishing attempt crafted for a specific person, team, or organisation using details that make the message seem credible.",
    explanation:
      "Unlike a generic mass email, spear phishing uses real names, projects, or events so the request sounds normal. Personalisation is a tactic, not evidence that the sender is genuine.",
    example:
      "A message references a real project and asks an employee to send a customer list to a new address, without following the usual approval process.",
    category: "Phishing",
    difficulty: "Intermediate",
    keywords: ["targeted phishing", "spear phishing", "personalised attack"],
    relatedTerms: [
      "phishing",
      "whaling",
      "business-email-compromise",
      "social-engineering",
    ],
    lessonSlugs: ["spear-phishing-and-targeted-attacks"],
  },
  {
    id: "whaling",
    term: "Whaling",
    definition:
      "A spear-phishing attack aimed at senior or high-authority individuals, such as executives or finance leaders.",
    explanation:
      "A whaling message impersonates or targets a senior person because their access or authority can authorise payments and data sharing. Seniority is not proof that a request is real.",
    example:
      "An email appears to come from the chief executive and asks the finance team to prepare an urgent, confidential payment before a board meeting.",
    category: "Phishing",
    difficulty: "Intermediate",
    keywords: ["whaling", "executive phishing", "ceo fraud"],
    relatedTerms: ["spear-phishing", "business-email-compromise", "impersonation"],
    lessonSlugs: ["spear-phishing-and-targeted-attacks"],
  },
  {
    id: "business-email-compromise",
    term: "Business email compromise (BEC)",
    definition:
      "A fraud where an attacker impersonates or takes over a business email account to influence payments, payroll, or sensitive data sharing.",
    explanation:
      "BEC often avoids links and malware, relying instead on a believable business request. A familiar display name cannot prove who sent or controls the account.",
    example:
      "A supplier emails a change of bank details, and the payment is redirected to an account the attacker controls after a rushed approval.",
    category: "Phishing",
    difficulty: "Intermediate",
    keywords: ["bec", "email fraud", "invoice fraud", "payment diversion"],
    relatedTerms: [
      "spear-phishing",
      "whaling",
      "email-spoofing",
      "social-engineering",
    ],
    lessonSlugs: ["spear-phishing-and-targeted-attacks", "email-phishing"],
  },
  {
    id: "smishing",
    term: "Smishing",
    definition:
      "Phishing delivered through SMS or a similar text-messaging channel.",
    explanation:
      "Short text messages feel personal and immediate, which makes them effective for fake delivery, toll, or account alerts. The claim should be verified through the official service, not the message link.",
    example:
      "A text says a parcel is on hold until a small fee is paid through a link, and the link opens a page that asks for card details.",
    category: "Phishing",
    difficulty: "Beginner",
    keywords: ["smishing", "sms phishing", "text scam"],
    relatedTerms: ["phishing", "vishing", "quishing", "typosquatting"],
    lessonSlugs: ["sms-phishing-smishing"],
  },
  {
    id: "vishing",
    term: "Vishing",
    definition: "Phishing carried out through a phone or voice call.",
    explanation:
      "A caller may use urgency, authority, or a familiar brand to persuade you to reveal information or approve a sign-in. Caller ID and a confident voice do not verify identity.",
    example:
      "A caller claiming to be from technical support asks you to install a remote-access tool so they can fix a problem you never reported.",
    category: "Phishing",
    difficulty: "Beginner",
    keywords: ["vishing", "voice phishing", "phone scam"],
    relatedTerms: ["phishing", "smishing", "impersonation", "social-engineering"],
    lessonSlugs: ["voice-phishing-vishing"],
  },
  {
    id: "quishing",
    term: "Quishing",
    definition:
      "Phishing that uses a QR code to send a victim to a deceptive website or payment page.",
    explanation:
      "Because a QR code hides its destination, you cannot see the address before scanning it. The phone may also open the link without a full preview, so treat unexpected codes cautiously.",
    example:
      "A sticker with a QR code placed over a car park payment machine opens a fake payment page that captures card details.",
    category: "Phishing",
    difficulty: "Intermediate",
    keywords: ["quishing", "qr code phishing", "qr scam"],
    relatedTerms: ["phishing", "smishing", "url-spoofing"],
    lessonSlugs: ["sms-phishing-smishing"],
  },
  {
    id: "credential-harvesting",
    term: "Credential harvesting",
    definition:
      "Collecting usernames and passwords, often through a fake sign-in page, for later misuse.",
    explanation:
      "The goal is the password itself, not malware. A convincing copy of a real login page can capture whatever you type, even if the real service is secure.",
    example:
      "A link in an unexpected email opens a page that looks like a cloud sign-in, then stores the entered password and redirects you to the real site.",
    category: "Phishing",
    difficulty: "Intermediate",
    keywords: ["credential harvesting", "credential theft", "fake login"],
    relatedTerms: [
      "phishing",
      "credential-stuffing",
      "homoglyph-attack",
      "https",
    ],
    lessonSlugs: ["fake-websites-and-domain-spoofing"],
  },

  // Network Security
  {
    id: "firewall",
    term: "Firewall",
    definition:
      "A security control that allows or blocks network traffic according to a defined set of rules.",
    explanation:
      "A firewall sits between networks or devices and decides what may pass. It reduces exposure but cannot stop every threat, such as a user following a deceptive link.",
    example:
      "An office firewall blocks inbound connections to internal servers except for approved services, reducing what an outsider can reach.",
    category: "Network Security",
    difficulty: "Beginner",
    keywords: ["firewall", "traffic filtering", "network control"],
    relatedTerms: ["network-segmentation", "intrusion-detection-system", "zero-trust"],
    lessonSlugs: ["safe-browsing-habits"],
  },
  {
    id: "virtual-private-network",
    term: "Virtual private network (VPN)",
    definition:
      "A service that creates an encrypted tunnel between a device and a remote network or server.",
    explanation:
      "A VPN protects traffic between your device and the VPN endpoint and can hide your address from the local network. It does not make you anonymous online and cannot make an untrustworthy website safe.",
    example:
      "An employee working from a cafe connects to the company VPN so work traffic is encrypted and routed through the company network.",
    category: "Network Security",
    difficulty: "Beginner",
    keywords: ["vpn", "encrypted tunnel", "remote access"],
    relatedTerms: ["encryption", "transport-layer-security", "zero-trust"],
    lessonSlugs: ["safe-browsing-habits"],
  },
  {
    id: "intrusion-detection-system",
    term: "Intrusion detection system (IDS)",
    definition:
      "A tool that monitors network or system activity for signs of malicious behaviour and raises alerts.",
    explanation:
      "An IDS watches for patterns that suggest an attack and notifies people, but it usually does not block traffic by itself. Alerts still need human review and can produce false positives.",
    example:
      "An IDS flags a burst of login failures against many accounts, prompting staff to investigate a possible password-spraying attempt.",
    category: "Network Security",
    difficulty: "Intermediate",
    keywords: ["ids", "intrusion detection", "network monitoring"],
    relatedTerms: ["security-operations-centre", "siem", "log", "firewall"],
    lessonSlugs: ["reporting-suspicious-activity"],
  },
  {
    id: "network-segmentation",
    term: "Network segmentation",
    definition:
      "Dividing a network into smaller parts so that access and damage are limited to one section.",
    explanation:
      "If an attacker compromises one segment, segmentation makes it harder to reach other systems. It also limits how far a single misconfiguration can spread.",
    example:
      "Payment systems are placed on a separate network segment from guest Wi-Fi so a compromised visitor device cannot reach them.",
    category: "Network Security",
    difficulty: "Intermediate",
    keywords: ["segmentation", "network isolation", "zones"],
    relatedTerms: ["firewall", "zero-trust", "attack-surface"],
    lessonSlugs: [],
  },
  {
    id: "man-in-the-middle-attack",
    term: "Man-in-the-middle attack",
    definition:
      "An attack where an attacker secretly relays or alters communication between two parties who believe they are talking directly to each other.",
    explanation:
      "The attacker positions themselves between the two sides to read or change traffic. Encryption such as HTTPS makes this harder, but a fake access point or an installed certificate can still enable it.",
    example:
      "On an open Wi-Fi network, an attacker intercepts a device's traffic by presenting themselves as the access point.",
    category: "Network Security",
    difficulty: "Intermediate",
    keywords: ["mitm", "eavesdropping", "session interception"],
    relatedTerms: [
      "encryption",
      "transport-layer-security",
      "domain-name-system",
      "virtual-private-network",
    ],
    lessonSlugs: ["safe-browsing-habits"],
  },
  {
    id: "domain-name-system",
    term: "Domain name system (DNS)",
    definition:
      "The system that translates human-readable domain names into the numeric addresses computers use to reach services.",
    explanation:
      "DNS acts like a directory for the internet. Because it is essential and often trusted by default, attackers may abuse DNS for redirection or to hide malicious destinations.",
    example:
      "Typing a website address sends a DNS lookup that returns the server's IP address so the browser can connect.",
    category: "Network Security",
    difficulty: "Intermediate",
    keywords: ["dns", "name resolution", "domain"],
    relatedTerms: ["url-spoofing", "typosquatting", "firewall"],
    lessonSlugs: ["fake-websites-and-domain-spoofing"],
  },
  {
    id: "denial-of-service",
    term: "Denial of service (DoS)",
    definition:
      "An attack that makes a service unavailable, typically by overwhelming it with traffic or exhausting its resources.",
    explanation:
      "A distributed denial of service (DDoS) uses many machines at once to increase the impact and hide the source. Availability, not data theft, is usually the target.",
    example:
      "A website becomes unreachable because thousands of compromised devices send requests at the same time.",
    category: "Network Security",
    difficulty: "Intermediate",
    keywords: ["dos", "ddos", "availability attack", "traffic flood"],
    relatedTerms: ["botnet", "firewall", "cia-triad"],
    lessonSlugs: [],
  },
  {
    id: "zero-trust",
    term: "Zero trust",
    definition:
      "A security approach that assumes no network location is inherently trusted and verifies every access request.",
    explanation:
      "Rather than trusting everything inside a network perimeter, zero trust checks identity, device, and context for each request. It is a design principle, not a single product.",
    example:
      "An employee must use multi-factor authentication and a managed device to reach an internal application, even when working in the office.",
    category: "Network Security",
    difficulty: "Advanced",
    keywords: ["zero trust", "never trust always verify", "least privilege"],
    relatedTerms: [
      "principle-of-least-privilege",
      "multi-factor-authentication",
      "network-segmentation",
      "defense-in-depth",
    ],
    lessonSlugs: ["multi-factor-authentication"],
  },

  // Authentication and Authorization
  {
    id: "authentication",
    term: "Authentication",
    definition:
      "Verifying that a person or system is who they claim to be before granting access.",
    explanation:
      "Authentication answers the question 'who are you?' using something you know, have, or are. It is different from authorization, which decides what you may do.",
    example:
      "Signing in with a username and password is an authentication step before a service considers what you can access.",
    category: "Authentication and Authorization",
    difficulty: "Beginner",
    keywords: ["authentication", "sign-in", "identity verification"],
    relatedTerms: [
      "authorization",
      "multi-factor-authentication",
      "passkey",
      "password-manager",
    ],
    lessonSlugs: ["password-and-account-security"],
  },
  {
    id: "authorization",
    term: "Authorization",
    definition:
      "Deciding what an authenticated user or system is allowed to access or do.",
    explanation:
      "Authorization answers 'what may you do?' after identity is confirmed. Weak authorization can let a valid user reach data or actions beyond their role.",
    example:
      "A signed-in employee can view their own payslips but not those of colleagues, because the system checks their role.",
    category: "Authentication and Authorization",
    difficulty: "Beginner",
    keywords: ["authorization", "access control", "permissions"],
    relatedTerms: [
      "authentication",
      "principle-of-least-privilege",
      "single-sign-on",
      "oauth",
    ],
    lessonSlugs: ["password-and-account-security"],
  },
  {
    id: "multi-factor-authentication",
    term: "Multi-factor authentication (MFA)",
    definition:
      "Sign-in that requires more than one kind of evidence, such as a password plus a code or security key.",
    explanation:
      "MFA reduces the impact of a stolen password because a second factor is also required. Unexpected prompts and requests for codes should still be treated as warning signs.",
    example:
      "After entering a password, a user approves a prompt in an authenticator app to finish signing in.",
    category: "Authentication and Authorization",
    difficulty: "Beginner",
    keywords: ["mfa", "two-factor", "2fa", "second factor"],
    relatedTerms: ["authentication", "passkey", "single-sign-on", "credential-stuffing"],
    lessonSlugs: ["multi-factor-authentication"],
  },
  {
    id: "oauth",
    term: "OAuth",
    definition:
      "An open standard that lets an application access resources on another service on a user's behalf without sharing the user's password.",
    explanation:
      "OAuth issues an access token with a limited scope instead of handing over credentials. It governs delegated authorisation, though it is often combined with sign-in flows.",
    example:
      "A photo-printing service is granted limited access to your cloud photos without ever receiving your account password.",
    category: "Authentication and Authorization",
    difficulty: "Advanced",
    keywords: ["oauth", "access token", "delegated access", "authorisation"],
    relatedTerms: ["authorization", "authentication", "single-sign-on"],
    lessonSlugs: [],
  },
  {
    id: "password-manager",
    term: "Password manager",
    definition:
      "A tool that generates, stores, and fills unique passwords for different accounts.",
    explanation:
      "Because it remembers the passwords, you can use a strong, different password for every service. The manager itself should be protected with a strong password and MFA.",
    example:
      "A password manager fills a unique password for each site, so a breach at one service does not put other accounts at risk.",
    category: "Authentication and Authorization",
    difficulty: "Beginner",
    keywords: ["password manager", "vault", "unique passwords"],
    relatedTerms: ["authentication", "multi-factor-authentication", "hashing"],
    lessonSlugs: ["password-and-account-security"],
  },
  {
    id: "passkey",
    term: "Passkey",
    definition:
      "A phishing-resistant sign-in method that uses a cryptographic key pair tied to a service instead of a shared password.",
    explanation:
      "The private key stays on your device and is never sent to the website, and the key is bound to the real domain. This makes passkeys harder to steal through a fake login page.",
    example:
      "A user signs in by confirming with their device's biometric check, and no password is typed or transmitted.",
    category: "Authentication and Authorization",
    difficulty: "Intermediate",
    keywords: ["passkey", "fido2", "passwordless", "phishing-resistant"],
    relatedTerms: ["authentication", "multi-factor-authentication", "asymmetric-encryption"],
    lessonSlugs: ["multi-factor-authentication"],
  },
  {
    id: "single-sign-on",
    term: "Single sign-on (SSO)",
    definition:
      "A setup where one sign-in grants access to multiple connected applications.",
    explanation:
      "SSO reduces password sprawl and centralises sign-in checks. Because one account unlocks many services, it should be strongly protected with MFA.",
    example:
      "After signing in to a company identity provider once, an employee can open several internal tools without entering a password again.",
    category: "Authentication and Authorization",
    difficulty: "Intermediate",
    keywords: ["sso", "single sign-on", "identity provider"],
    relatedTerms: ["authentication", "oauth", "multi-factor-authentication", "authorization"],
    lessonSlugs: ["multi-factor-authentication"],
  },
  {
    id: "principle-of-least-privilege",
    term: "Principle of least privilege",
    definition:
      "Giving people and systems only the access they need to perform a task, and no more.",
    explanation:
      "Limiting permissions reduces the damage a compromised account or a mistake can cause. Access should be reviewed and removed when it is no longer needed.",
    example:
      "A staff member who only needs to read reports is given read access rather than full administrative rights.",
    category: "Authentication and Authorization",
    difficulty: "Intermediate",
    keywords: ["least privilege", "minimal access", "access control"],
    relatedTerms: ["authorization", "zero-trust", "privilege-escalation", "defense-in-depth"],
    lessonSlugs: ["password-and-account-security"],
  },
  {
    id: "credential-stuffing",
    term: "Credential stuffing",
    definition:
      "Using lists of usernames and passwords stolen from one service to try signing in to other services.",
    explanation:
      "It exploits password reuse: if the same password works on several sites, one breach can unlock many accounts. Unique passwords and MFA make this far less effective.",
    example:
      "After a data breach, attackers try the leaked email and password combinations against popular shopping and email sites.",
    category: "Authentication and Authorization",
    difficulty: "Intermediate",
    keywords: ["credential stuffing", "password reuse", "stolen credentials"],
    relatedTerms: [
      "credential-harvesting",
      "password-spraying",
      "password-manager",
      "multi-factor-authentication",
    ],
    lessonSlugs: ["password-and-account-security"],
  },
  {
    id: "password-spraying",
    term: "Password spraying",
    definition:
      "Trying a small number of common passwords across many accounts to avoid lockouts.",
    explanation:
      "Instead of many attempts on one account, an attacker spreads a few guesses widely, hoping one weak password works. It is quieter and can evade lockout policies.",
    example:
      "An attacker tries the password 'Summer2025!' once against hundreds of accounts on the same service.",
    category: "Authentication and Authorization",
    difficulty: "Intermediate",
    keywords: ["password spraying", "brute force", "weak passwords"],
    relatedTerms: ["credential-stuffing", "authentication", "log"],
    lessonSlugs: ["password-and-account-security"],
  },

  // Web Security
  {
    id: "https",
    term: "HTTPS",
    definition:
      "The encrypted version of HTTP that protects data sent between a browser and a website.",
    explanation:
      "HTTPS encrypts the connection so others on the network cannot easily read it. It does not prove that a website is trustworthy, only that the connection is protected.",
    example:
      "A browser shows a lock icon on an address starting with 'https://', meaning the connection to that site is encrypted.",
    category: "Web Security",
    difficulty: "Beginner",
    keywords: ["https", "tls", "ssl", "lock icon", "secure connection"],
    relatedTerms: ["transport-layer-security", "encryption", "url-spoofing", "homoglyph-attack"],
    lessonSlugs: ["safe-browsing-habits"],
  },
  {
    id: "homoglyph-attack",
    term: "Homoglyph attack",
    definition:
      "Using characters that look alike to make an address or name resemble a trusted one.",
    explanation:
      "Attackers substitute similar letters or symbols, or use non-Latin characters, so a fake domain looks like the real brand. Careful reading of the full address helps.",
    example:
      "A domain replaces the letter 'l' with a similar-looking character so it appears to be a well-known brand.",
    category: "Web Security",
    difficulty: "Intermediate",
    keywords: ["homoglyph", "lookalike characters", "idn", "punycode"],
    relatedTerms: ["typosquatting", "url-spoofing", "credential-harvesting"],
    lessonSlugs: ["fake-websites-and-domain-spoofing"],
  },
  {
    id: "typosquatting",
    term: "Typosquatting",
    definition:
      "Registering a domain that is a slight misspelling or variation of a legitimate one.",
    explanation:
      "The fake domain relies on typing errors, swapped letters, or extra words. It often hosts deceptive pages that imitate the real brand.",
    example:
      "A site registers a domain with the letters in a popular brand name slightly reordered to catch mistyped addresses.",
    category: "Web Security",
    difficulty: "Beginner",
    keywords: ["typosquatting", "lookalike domain", "misspelled domain"],
    relatedTerms: ["homoglyph-attack", "url-spoofing", "domain-name-system"],
    lessonSlugs: ["fake-websites-and-domain-spoofing"],
  },
  {
    id: "url-spoofing",
    term: "URL spoofing",
    definition:
      "Crafting a web address so it appears to point at a trusted site when it actually leads elsewhere.",
    explanation:
      "Techniques include misleading subdomains, extra words, or characters that hide the real destination. Reading the registered domain from right to left is more reliable than trusting the start of the address.",
    example:
      "An address places a brand name in a subdomain, while the actual registered domain belongs to an unrelated site.",
    category: "Web Security",
    difficulty: "Intermediate",
    keywords: ["url spoofing", "fake link", "misleading address"],
    relatedTerms: ["homoglyph-attack", "typosquatting", "open-redirect", "https"],
    lessonSlugs: ["fake-websites-and-domain-spoofing", "malicious-links-and-attachments"],
  },
  {
    id: "cross-site-scripting",
    term: "Cross-site scripting (XSS)",
    definition:
      "A web vulnerability where an attacker injects script that runs in another user's browser.",
    explanation:
      "If a site shows untrusted input without proper handling, injected script can steal data or act as the user. Output encoding and input handling reduce the risk.",
    example:
      "A comment field that accepts raw HTML lets an attacker post a script that runs for everyone who views the page.",
    category: "Web Security",
    difficulty: "Intermediate",
    keywords: ["xss", "cross-site scripting", "script injection"],
    relatedTerms: ["sql-injection", "content-security-policy", "clickjacking", "vulnerability"],
    lessonSlugs: [],
  },
  {
    id: "sql-injection",
    term: "SQL injection",
    definition:
      "A vulnerability where untrusted input is interpreted as database commands, letting an attacker read or change stored data.",
    explanation:
      "It happens when user input is inserted into a database query without proper handling. Parameterised queries and validation prevent it.",
    example:
      "A login form that builds a query from raw text lets an attacker supply input that alters the database command.",
    category: "Web Security",
    difficulty: "Intermediate",
    keywords: ["sql injection", "sqli", "database attack"],
    relatedTerms: ["cross-site-scripting", "vulnerability", "exploit", "data-breach"],
    lessonSlugs: [],
  },
  {
    id: "clickjacking",
    term: "Clickjacking",
    definition:
      "Tricking a user into clicking something different from what they think they are clicking, often by layering web content.",
    explanation:
      "The attacker hides or disguises elements so a click performs an unintended action, such as approving a setting. Framing protections and clear interface design reduce the risk.",
    example:
      "An invisible button is placed over a page element so a user's click silently performs another action.",
    category: "Web Security",
    difficulty: "Advanced",
    keywords: ["clickjacking", "ui redressing", "overlay attack"],
    relatedTerms: ["cross-site-scripting", "content-security-policy", "open-redirect"],
    lessonSlugs: [],
  },
  {
    id: "open-redirect",
    term: "Open redirect",
    definition:
      "A flaw where a trusted site forwards users to an address supplied by the request, which an attacker can control.",
    explanation:
      "Because the link starts on a trusted domain, it can look trustworthy while sending the user to a malicious page. Validating redirect destinations prevents this.",
    example:
      "A sign-in link on a trusted domain includes a parameter that sends the user to an unrelated site after login.",
    category: "Web Security",
    difficulty: "Intermediate",
    keywords: ["open redirect", "redirect abuse", "unvalidated redirect"],
    relatedTerms: ["url-spoofing", "phishing"],
    lessonSlugs: ["malicious-links-and-attachments"],
  },
  {
    id: "content-security-policy",
    term: "Content Security Policy (CSP)",
    definition:
      "A browser feature that lets a site declare which sources of content it allows, helping to block script injection.",
    explanation:
      "CSP is a defence-in-depth layer against issues such as cross-site scripting. It restricts where scripts and other resources may load from, but must be configured correctly to help.",
    example:
      "A site sets a policy that only allows scripts from its own domain, so an injected script from elsewhere is blocked.",
    category: "Web Security",
    difficulty: "Advanced",
    keywords: ["csp", "content security policy", "browser policy"],
    relatedTerms: ["cross-site-scripting", "clickjacking", "defense-in-depth"],
    lessonSlugs: [],
  },

  // Social Engineering
  {
    id: "social-engineering",
    term: "Social engineering",
    definition:
      "Using influence, trust, or deception to persuade someone to take an action or share information.",
    explanation:
      "It targets people rather than technology, often using authority, urgency, fear, or friendliness. Understanding the tactic helps you pause and verify.",
    example:
      "A caller claims to be a colleague and asks for a code to 'fix' an account, hoping to gain access.",
    category: "Social Engineering",
    difficulty: "Beginner",
    keywords: ["social engineering", "manipulation", "influence tactics"],
    relatedTerms: [
      "phishing",
      "pretexting",
      "baiting",
      "impersonation",
      "vishing",
    ],
    lessonSlugs: ["social-engineering"],
  },
  {
    id: "pretexting",
    term: "Pretexting",
    definition:
      "Inventing a believable scenario or identity to persuade someone to reveal information or take an action.",
    explanation:
      "The attacker creates a story that makes the request seem reasonable, such as pretending to be an auditor or a new colleague. The story's plausibility is not proof it is genuine.",
    example:
      "Someone poses as an IT auditor and asks an employee to confirm their login details as part of a 'review'.",
    category: "Social Engineering",
    difficulty: "Intermediate",
    keywords: ["pretexting", "cover story", "false scenario"],
    relatedTerms: ["social-engineering", "impersonation", "phishing", "spear-phishing"],
    lessonSlugs: ["social-engineering"],
  },
  {
    id: "baiting",
    term: "Baiting",
    definition:
      "Offering something appealing, such as a free download or a found device, to lure someone into a risky action.",
    explanation:
      "Baiting relies on curiosity or greed. The tempting item is used to deliver malware or extract information once the target takes the bait.",
    example:
      "A USB drive labelled 'payroll' is left in a car park, and whoever plugs it in may infect their computer.",
    category: "Social Engineering",
    difficulty: "Intermediate",
    keywords: ["baiting", "usb drop", "lure"],
    relatedTerms: ["social-engineering", "malware", "pretexting"],
    lessonSlugs: ["social-engineering"],
  },
  {
    id: "tailgating",
    term: "Tailgating",
    definition:
      "Following an authorised person into a restricted physical area without their own credentials.",
    explanation:
      "It exploits politeness and the assumption that anyone nearby belongs there. Physical access can lead to theft or to network compromise from inside.",
    example:
      "An attacker carrying boxes asks a staff member to hold a secure door, then enters the restricted area.",
    category: "Social Engineering",
    difficulty: "Beginner",
    keywords: ["tailgating", "physical access", "piggybacking"],
    relatedTerms: ["social-engineering", "shoulder-surfing"],
    lessonSlugs: ["social-engineering"],
  },
  {
    id: "shoulder-surfing",
    term: "Shoulder surfing",
    definition:
      "Watching someone enter information such as a password or PIN over their shoulder.",
    explanation:
      "It is a simple physical technique that needs no technology. Shielded screens, privacy filters, and awareness reduce the opportunity.",
    example:
      "A person watches a commuter type a laptop password on a train and later uses it.",
    category: "Social Engineering",
    difficulty: "Beginner",
    keywords: ["shoulder surfing", "observation", "privacy"],
    relatedTerms: ["social-engineering", "tailgating", "authentication"],
    lessonSlugs: ["password-and-account-security"],
  },
  {
    id: "impersonation",
    term: "Impersonation",
    definition:
      "Pretending to be a trusted person or organisation to gain trust and influence an action.",
    explanation:
      "Impersonation can be digital or in person and often supports phishing or fraud. Verifying identity through a separate, known channel breaks the deception.",
    example:
      "An email display name copies a manager's name while the actual address belongs to someone else.",
    category: "Social Engineering",
    difficulty: "Intermediate",
    keywords: ["impersonation", "spoofing", "identity fraud"],
    relatedTerms: [
      "social-engineering",
      "pretexting",
      "display-name-spoofing",
      "whaling",
      "vishing",
    ],
    lessonSlugs: ["social-engineering", "voice-phishing-vishing"],
  },
  {
    id: "watering-hole-attack",
    term: "Watering hole attack",
    definition:
      "Compromising a website that a particular group is known to visit, in order to infect its members.",
    explanation:
      "Instead of targeting individuals directly, the attacker waits at a familiar destination. The site itself appears legitimate, so visitors have little reason to be suspicious.",
    example:
      "Attackers compromise an industry forum and inject code that targets visitors from specific organisations.",
    category: "Social Engineering",
    difficulty: "Advanced",
    keywords: ["watering hole", "strategic web compromise", "targeted"],
    relatedTerms: ["spear-phishing", "malware", "phishing"],
    lessonSlugs: [],
  },

  // Malware and Threats
  {
    id: "malware",
    term: "Malware",
    definition:
      "Software designed to harm, disrupt, or gain unauthorised access to a system.",
    explanation:
      "Malware is an umbrella term covering viruses, worms, trojans, ransomware, spyware, and more. It usually arrives through a download, attachment, or exploited flaw.",
    example:
      "A program that secretly encrypts a user's files and demands payment is a form of malware.",
    category: "Malware and Threats",
    difficulty: "Beginner",
    keywords: ["malware", "malicious software", "threat"],
    relatedTerms: ["virus", "worm", "trojan-horse", "ransomware", "spyware"],
    lessonSlugs: ["malicious-links-and-attachments"],
  },
  {
    id: "virus",
    term: "Virus",
    definition:
      "Malware that attaches to a file or program and spreads when that host is run or shared.",
    explanation:
      "A virus needs a host and some action, such as opening a file, to spread. It can corrupt data or deliver other harmful payloads.",
    example:
      "An infected document, once opened and shared, copies itself into other files on the same system.",
    category: "Malware and Threats",
    difficulty: "Beginner",
    keywords: ["virus", "file infector", "self-replicating"],
    relatedTerms: ["malware", "worm", "trojan-horse", "macro-virus"],
    lessonSlugs: ["malicious-links-and-attachments"],
  },
  {
    id: "worm",
    term: "Worm",
    definition:
      "Malware that spreads by itself across networks without needing a host file or user action.",
    explanation:
      "A worm exploits flaws or weak settings to copy itself to other systems. Its self-spreading nature can make it spread very quickly.",
    example:
      "A worm scans a network for systems with an unpatched service and copies itself to each one it can reach.",
    category: "Malware and Threats",
    difficulty: "Beginner",
    keywords: ["worm", "self-propagating", "network spread"],
    relatedTerms: ["malware", "virus", "botnet", "patch-management"],
    lessonSlugs: ["malicious-links-and-attachments"],
  },
  {
    id: "trojan-horse",
    term: "Trojan horse",
    definition:
      "Malware disguised as legitimate or useful software that performs hidden harmful actions.",
    explanation:
      "Unlike a virus, a trojan does not self-replicate; it relies on being installed by the user. The deception is the disguise, not the spread.",
    example:
      "A free video player downloaded from an unofficial site secretly installs a backdoor alongside the app.",
    category: "Malware and Threats",
    difficulty: "Beginner",
    keywords: ["trojan", "disguised malware", "fake software"],
    relatedTerms: ["malware", "virus", "ransomware", "spyware"],
    lessonSlugs: ["malicious-links-and-attachments"],
  },
  {
    id: "ransomware",
    term: "Ransomware",
    definition:
      "Malware that blocks access to files or systems and demands payment to restore them.",
    explanation:
      "Ransomware often encrypts data and may also steal it to pressure victims. Reliable backups and prompt reporting limit the damage; paying does not guarantee recovery.",
    example:
      "An attachment installs ransomware that encrypts shared files and displays a payment demand.",
    category: "Malware and Threats",
    difficulty: "Beginner",
    keywords: ["ransomware", "encryption attack", "extortion"],
    relatedTerms: ["malware", "trojan-horse", "data-breach", "incident-response"],
    lessonSlugs: ["malicious-links-and-attachments", "reporting-suspicious-activity"],
  },
  {
    id: "spyware",
    term: "Spyware",
    definition:
      "Malware that secretly collects information about a user's activity and sends it to someone else.",
    explanation:
      "Spyware may gather browsing habits, messages, or credentials while trying to stay unnoticed. It often arrives bundled with other software.",
    example:
      "A hidden program records which websites a user visits and reports them to an external server.",
    category: "Malware and Threats",
    difficulty: "Beginner",
    keywords: ["spyware", "surveillance", "data collection"],
    relatedTerms: ["malware", "keylogger", "trojan-horse", "metadata"],
    lessonSlugs: ["malicious-links-and-attachments"],
  },
  {
    id: "keylogger",
    term: "Keylogger",
    definition: "Software or hardware that records the keys a user types.",
    explanation:
      "A keylogger can capture passwords and messages as they are entered. Software keyloggers hide in malware; hardware versions attach between a keyboard and computer.",
    example:
      "Malware on a computer records everything typed, including a bank password entered on a website.",
    category: "Malware and Threats",
    difficulty: "Intermediate",
    keywords: ["keylogger", "keystroke logging", "input capture"],
    relatedTerms: ["spyware", "malware", "credential-harvesting"],
    lessonSlugs: ["malicious-links-and-attachments"],
  },
  {
    id: "botnet",
    term: "Botnet",
    definition:
      "A network of compromised devices, called bots, that an attacker controls remotely.",
    explanation:
      "Each infected device runs software that follows the attacker's instructions. Botnets are used for spam, fraud, and large-scale denial-of-service attacks.",
    example:
      "Thousands of infected home routers are commanded to flood a website with traffic.",
    category: "Malware and Threats",
    difficulty: "Intermediate",
    keywords: ["botnet", "bot", "command and control", "zombie devices"],
    relatedTerms: ["malware", "denial-of-service", "worm"],
    lessonSlugs: [],
  },

  // Email Security
  {
    id: "email-spoofing",
    term: "Email spoofing",
    definition:
      "Forging parts of an email, such as the sender address, so it appears to come from someone else.",
    explanation:
      "Email was not designed to prove the sender's identity, so the visible From address can be misleading. Authentication records such as SPF, DKIM, and DMARC help receiving systems detect forgery.",
    example:
      "A message shows a familiar sender address, but the underlying sending server was never authorised for that domain.",
    category: "Email Security",
    difficulty: "Intermediate",
    keywords: ["email spoofing", "sender forgery", "from address"],
    relatedTerms: [
      "display-name-spoofing",
      "sender-policy-framework",
      "dkim",
      "dmarc",
      "business-email-compromise",
    ],
    lessonSlugs: ["email-phishing"],
  },
  {
    id: "display-name-spoofing",
    term: "Display name spoofing",
    definition:
      "Setting a friendly or familiar display name in an email while the real address belongs to someone else.",
    explanation:
      "Many mail apps show only the display name, so the deceptive part is hidden. Checking the full address reveals more than the name alone.",
    example:
      "An email is shown as coming from 'IT Support', but the actual address is unrelated to the organisation.",
    category: "Email Security",
    difficulty: "Intermediate",
    keywords: ["display name spoofing", "sender name", "email impersonation"],
    relatedTerms: ["email-spoofing", "impersonation", "phishing"],
    lessonSlugs: ["email-phishing"],
  },
  {
    id: "sender-policy-framework",
    term: "Sender Policy Framework (SPF)",
    definition:
      "A DNS record that lists which servers are allowed to send email for a domain.",
    explanation:
      "Receiving systems can compare the sending server against the domain's SPF record. It helps detect some forged senders but does not by itself stop all spoofing.",
    example:
      "A domain publishes an SPF record so mail sent from unlisted servers can be flagged as suspicious.",
    category: "Email Security",
    difficulty: "Advanced",
    keywords: ["spf", "sender policy framework", "email authentication"],
    relatedTerms: ["dkim", "dmarc", "email-spoofing", "domain-name-system"],
    lessonSlugs: ["email-phishing"],
  },
  {
    id: "dkim",
    term: "DKIM",
    definition:
      "An email authentication method that adds a cryptographic signature so receivers can check a message was not altered in transit.",
    explanation:
      "DomainKeys Identified Mail signs parts of a message with a key published in DNS. It helps confirm integrity and that the domain authorised the message.",
    example:
      "A receiving server verifies the DKIM signature to confirm the message content was not changed after it was sent.",
    category: "Email Security",
    difficulty: "Advanced",
    keywords: ["dkim", "domainkeys identified mail", "email signature"],
    relatedTerms: ["sender-policy-framework", "dmarc", "digital-signature", "email-spoofing"],
    lessonSlugs: ["email-phishing"],
  },
  {
    id: "dmarc",
    term: "DMARC",
    definition:
      "A policy that tells receiving systems how to handle email that fails SPF or DKIM checks for a domain.",
    explanation:
      "Domain-based Message Authentication, Reporting, and Conformance builds on SPF and DKIM. It also lets a domain receive reports about how its mail is being handled.",
    example:
      "A domain sets a DMARC policy of 'reject' so messages failing authentication are not delivered.",
    category: "Email Security",
    difficulty: "Advanced",
    keywords: ["dmarc", "email policy", "domain alignment"],
    relatedTerms: ["sender-policy-framework", "dkim", "email-spoofing", "display-name-spoofing"],
    lessonSlugs: ["email-phishing"],
  },
  {
    id: "email-header",
    term: "Email header",
    definition:
      "The hidden technical information in an email that records its route and authentication results.",
    explanation:
      "Headers show the sending servers, timestamps, and authentication outcomes. They provide more reliable evidence than the visible From name when assessing a message.",
    example:
      "Reading the header reveals a reply-to address and sending server that differ from the display name shown in the inbox.",
    category: "Email Security",
    difficulty: "Intermediate",
    keywords: ["email header", "message headers", "mail routing"],
    relatedTerms: ["email-spoofing", "display-name-spoofing", "dmarc"],
    lessonSlugs: ["email-phishing"],
  },
  {
    id: "email-attachment",
    term: "Email attachment risk",
    definition:
      "The danger that a file attached to an email contains malware or tricks the reader into a risky action.",
    explanation:
      "Attachments can deliver harmful files or ask the reader to enable active content. Unexpected attachments should be verified before they are opened.",
    example:
      "A password-protected archive arrives unexpectedly and contains a document that asks the reader to enable macros.",
    category: "Email Security",
    difficulty: "Beginner",
    keywords: ["attachment", "malicious file", "document"],
    relatedTerms: ["malware", "macro-virus", "phishing", "trojan-horse"],
    lessonSlugs: ["malicious-links-and-attachments"],
  },
  {
    id: "macro-virus",
    term: "Macro virus",
    definition:
      "Malware that spreads through the macro feature of document files, such as spreadsheets or text documents.",
    explanation:
      "Macros are small programs inside documents that can automate tasks. Malicious macros run when enabled and may download or install other malware.",
    example:
      "A document tells the reader to 'enable content' to see the file, which then runs a harmful macro.",
    category: "Email Security",
    difficulty: "Intermediate",
    keywords: ["macro virus", "enable content", "document macro"],
    relatedTerms: ["virus", "email-attachment", "malware"],
    lessonSlugs: ["malicious-links-and-attachments"],
  },

  // Cryptography
  {
    id: "encryption",
    term: "Encryption",
    definition:
      "The process of converting readable data into a coded form that only authorised parties can reverse.",
    explanation:
      "Encryption uses a key to scramble data and protect it in transit or at rest. It protects confidentiality, but does not by itself prove who sent something or make a service trustworthy.",
    example:
      "A messaging app encrypts messages so they cannot be read if intercepted on the way to the recipient.",
    category: "Cryptography",
    difficulty: "Beginner",
    keywords: ["encryption", "cipher", "confidentiality"],
    relatedTerms: [
      "symmetric-encryption",
      "asymmetric-encryption",
      "hashing",
      "transport-layer-security",
      "end-to-end-encryption",
    ],
    lessonSlugs: ["safe-browsing-habits"],
  },
  {
    id: "symmetric-encryption",
    term: "Symmetric encryption",
    definition:
      "Encryption that uses the same secret key to both encrypt and decrypt data.",
    explanation:
      "It is fast and well suited to protecting data and bulk traffic. The main challenge is sharing the single key securely with the right parties.",
    example:
      "A file is encrypted and decrypted with the same passphrase, so both sides must already share that secret.",
    category: "Cryptography",
    difficulty: "Intermediate",
    keywords: ["symmetric encryption", "shared key", "secret key"],
    relatedTerms: ["encryption", "asymmetric-encryption", "transport-layer-security"],
    lessonSlugs: [],
  },
  {
    id: "asymmetric-encryption",
    term: "Asymmetric encryption",
    definition:
      "Encryption that uses a related key pair: a public key to encrypt and a private key to decrypt.",
    explanation:
      "Because the public key can be shared openly, asymmetric encryption helps solve the key-sharing problem. It is slower than symmetric encryption, so the two are often combined.",
    example:
      "A website's public key encrypts a session secret that only the site's private key can decrypt.",
    category: "Cryptography",
    difficulty: "Intermediate",
    keywords: ["asymmetric encryption", "public key", "private key", "key pair"],
    relatedTerms: [
      "encryption",
      "symmetric-encryption",
      "digital-signature",
      "certificate-authority",
      "public-key-infrastructure",
    ],
    lessonSlugs: [],
  },
  {
    id: "hashing",
    term: "Hashing",
    definition:
      "Converting data into a fixed-length value that cannot be reversed, used to check integrity or store passwords safely.",
    explanation:
      "A hash acts like a fingerprint: the same input always gives the same hash, but you cannot turn the hash back into the original. Good password storage uses slow, salted hashing.",
    example:
      "A service stores the hash of a password rather than the password itself, then compares hashes when you sign in.",
    category: "Cryptography",
    difficulty: "Intermediate",
    keywords: ["hash", "hash function", "integrity", "one-way"],
    relatedTerms: ["salt", "password-manager", "digital-signature"],
    lessonSlugs: ["password-and-account-security"],
  },
  {
    id: "salt",
    term: "Salt",
    definition:
      "Random data added to a value before hashing so that identical inputs produce different hashes.",
    explanation:
      "Salting means attackers cannot reuse one precomputed result for many accounts, and identical passwords do not reveal equal hashes. It is standard for password storage.",
    example:
      "Two users with the same password get different stored hashes because each password is salted with unique random data.",
    category: "Cryptography",
    difficulty: "Intermediate",
    keywords: ["salt", "salted hash", "password storage"],
    relatedTerms: ["hashing", "password-manager"],
    lessonSlugs: ["password-and-account-security"],
  },
  {
    id: "digital-signature",
    term: "Digital signature",
    definition:
      "A cryptographic value that proves a message or file came from the holder of a private key and was not changed.",
    explanation:
      "Signing uses a private key; anyone with the matching public key can verify it. Signatures provide integrity and authenticity, but not confidentiality by themselves.",
    example:
      "Software publishers sign updates so users can verify the download is genuine and unaltered.",
    category: "Cryptography",
    difficulty: "Intermediate",
    keywords: ["digital signature", "signing", "authenticity", "integrity"],
    relatedTerms: ["asymmetric-encryption", "hashing", "certificate-authority", "dkim"],
    lessonSlugs: [],
  },
  {
    id: "transport-layer-security",
    term: "Transport Layer Security (TLS)",
    definition:
      "The cryptographic protocol that encrypts and authenticates data between a client and a server, used by HTTPS.",
    explanation:
      "TLS protects traffic in transit and helps confirm a server's identity through a certificate. It secures the connection, not the trustworthiness of the content on the site.",
    example:
      "When you open a site over HTTPS, TLS negotiates an encrypted channel and checks the server's certificate.",
    category: "Cryptography",
    difficulty: "Intermediate",
    keywords: ["tls", "ssl", "https", "secure channel"],
    relatedTerms: ["https", "encryption", "certificate-authority", "virtual-private-network"],
    lessonSlugs: ["safe-browsing-habits"],
  },
  {
    id: "certificate-authority",
    term: "Certificate authority (CA)",
    definition:
      "A trusted organisation that issues digital certificates confirming the link between a public key and a website or entity.",
    explanation:
      "Browsers trust certificates signed by recognised authorities. A valid certificate shows the connection is to the named domain, but not that the site's purpose is honest.",
    example:
      "A website obtains a certificate from a recognised authority so browsers can establish a trusted, encrypted connection.",
    category: "Cryptography",
    difficulty: "Advanced",
    keywords: ["certificate authority", "ca", "digital certificate", "trust"],
    relatedTerms: [
      "digital-signature",
      "transport-layer-security",
      "public-key-infrastructure",
      "asymmetric-encryption",
    ],
    lessonSlugs: [],
  },
  {
    id: "end-to-end-encryption",
    term: "End-to-end encryption",
    definition:
      "Encryption where only the communicating users can read the messages, not the service in between.",
    explanation:
      "The service relays encrypted data it cannot decrypt. This protects content strongly, though metadata such as who contacted whom may still be visible.",
    example:
      "A messaging app encrypts a conversation so even the provider cannot read its contents.",
    category: "Cryptography",
    difficulty: "Intermediate",
    keywords: ["end-to-end encryption", "e2ee", "private messaging"],
    relatedTerms: ["encryption", "asymmetric-encryption", "metadata"],
    lessonSlugs: [],
  },
  {
    id: "public-key-infrastructure",
    term: "Public key infrastructure (PKI)",
    definition:
      "The systems, policies, and roles used to create, manage, and trust digital certificates and key pairs.",
    explanation:
      "PKI provides the trust framework behind HTTPS and signed software. It includes certificate authorities, registration processes, and revocation when a certificate must no longer be trusted.",
    example:
      "An organisation runs a PKI so internal services can use trusted certificates for encrypted connections.",
    category: "Cryptography",
    difficulty: "Advanced",
    keywords: ["pki", "public key infrastructure", "certificates", "trust chain"],
    relatedTerms: ["certificate-authority", "digital-signature", "transport-layer-security"],
    lessonSlugs: [],
  },

  // Privacy and Data Protection
  {
    id: "personal-data",
    term: "Personal data",
    definition:
      "Information relating to an identifiable person, such as a name, contact detail, or account identifier.",
    explanation:
      "Personal data is broader than just names; it can include anything that identifies or could identify someone. How it is collected and used raises privacy and legal questions.",
    example:
      "An email address combined with a purchase history is personal data about the customer.",
    category: "Privacy and Data Protection",
    difficulty: "Beginner",
    keywords: ["personal data", "privacy", "data protection"],
    relatedTerms: ["personally-identifiable-information", "data-breach", "data-minimisation", "metadata"],
    lessonSlugs: [],
  },
  {
    id: "personally-identifiable-information",
    term: "Personally identifiable information (PII)",
    definition:
      "Data that can be used, alone or with other information, to identify a specific individual.",
    explanation:
      "PII includes direct identifiers such as a name or ID number and indirect ones that become identifying when combined. Protecting it limits identity theft and fraud.",
    example:
      "A social security-style number is PII because it can identify and affect a specific person.",
    category: "Privacy and Data Protection",
    difficulty: "Beginner",
    keywords: ["pii", "personally identifiable information", "identifiers"],
    relatedTerms: ["personal-data", "data-breach", "pseudonymisation"],
    lessonSlugs: [],
  },
  {
    id: "data-breach",
    term: "Data breach",
    definition:
      "An incident where personal or confidential data is accessed, exposed, or stolen without authorisation.",
    explanation:
      "Breaches can result from attacks, mistakes, or misconfiguration. Their impact depends on what was exposed and prompts notification and remediation duties.",
    example:
      "A misconfigured database exposes customer records to the open internet until it is secured.",
    category: "Privacy and Data Protection",
    difficulty: "Beginner",
    keywords: ["data breach", "exposure", "incident"],
    relatedTerms: ["personal-data", "incident-response", "credential-stuffing", "sql-injection"],
    lessonSlugs: ["reporting-suspicious-activity"],
  },
  {
    id: "data-minimisation",
    term: "Data minimisation",
    definition:
      "Collecting and keeping only the personal data that is actually needed for a stated purpose.",
    explanation:
      "The less data you hold, the less there is to lose or misuse. Minimisation reduces breach impact and supports privacy by design.",
    example:
      "A sign-up form asks only for an email address instead of also requesting a phone number and home address.",
    category: "Privacy and Data Protection",
    difficulty: "Intermediate",
    keywords: ["data minimisation", "privacy by design", "least data"],
    relatedTerms: ["personal-data", "principle-of-least-privilege", "data-breach"],
    lessonSlugs: [],
  },
  {
    id: "third-party-cookie",
    term: "Third-party cookie",
    definition:
      "A cookie set by a domain other than the one you are visiting, often used to track activity across sites.",
    explanation:
      "Because the cookie is tied to an external domain, it can follow you between websites for advertising or analytics. Browsers increasingly restrict them for privacy reasons.",
    example:
      "An advertising network sets a cookie while you read a news site, then recognises you on another site later.",
    category: "Privacy and Data Protection",
    difficulty: "Intermediate",
    keywords: ["cookie", "tracking", "third-party", "advertising"],
    relatedTerms: ["metadata", "personal-data", "https"],
    lessonSlugs: ["safe-browsing-habits"],
  },
  {
    id: "metadata",
    term: "Metadata",
    definition:
      "Data that describes other data, such as when a file was created, who sent a message, or where a photo was taken.",
    explanation:
      "Metadata often survives encryption and can reveal sensitive context even when content is protected. It should be considered when assessing privacy.",
    example:
      "A photo's location tag reveals where it was taken, even if the image itself was shared privately.",
    category: "Privacy and Data Protection",
    difficulty: "Intermediate",
    keywords: ["metadata", "context data", "descriptive data"],
    relatedTerms: ["personal-data", "end-to-end-encryption", "third-party-cookie"],
    lessonSlugs: [],
  },
  {
    id: "pseudonymisation",
    term: "Pseudonymisation",
    definition:
      "Replacing identifying details with a value that can be linked back only with additional information kept separately.",
    explanation:
      "It reduces direct exposure of identities while still allowing records to be linked for analysis. Unlike anonymisation, it is reversible if the extra information is combined again.",
    example:
      "A dataset replaces customer names with random codes, keeping the name-to-code list in a separate secure store.",
    category: "Privacy and Data Protection",
    difficulty: "Advanced",
    keywords: ["pseudonymisation", "re-identification", "de-identification"],
    relatedTerms: ["personally-identifiable-information", "personal-data", "data-minimisation"],
    lessonSlugs: [],
  },

  // Operating System Security
  {
    id: "patch-management",
    term: "Patch management",
    definition:
      "The practice of regularly applying software updates that fix bugs and security flaws.",
    explanation:
      "Many attacks exploit known flaws that already have fixes. Installing updates promptly, and removing software you no longer use, shrinks that window of exposure.",
    example:
      "An operating system update fixes a flaw that attackers were actively exploiting, protecting updated devices.",
    category: "Operating System Security",
    difficulty: "Beginner",
    keywords: ["patch management", "updates", "vulnerability fix"],
    relatedTerms: ["vulnerability", "system-hardening", "worm", "cyber-hygiene"],
    lessonSlugs: ["safe-browsing-habits"],
  },
  {
    id: "antivirus-software",
    term: "Antivirus software",
    definition:
      "Software that detects and blocks known malicious programs on a device.",
    explanation:
      "Antivirus relies on signatures and behaviour analysis, so it catches many but not all threats. It works best alongside updates and safe habits rather than as a sole defence.",
    example:
      "Antivirus blocks a downloaded file that matches a known malware signature.",
    category: "Operating System Security",
    difficulty: "Beginner",
    keywords: ["antivirus", "anti-malware", "endpoint protection"],
    relatedTerms: ["malware", "endpoint-security", "patch-management", "defense-in-depth"],
    lessonSlugs: ["safe-browsing-habits"],
  },
  {
    id: "endpoint-security",
    term: "Endpoint security",
    definition:
      "Protecting end-user devices such as laptops, phones, and servers from threats.",
    explanation:
      "Endpoints are frequent targets, so they are protected with updates, access controls, and monitoring. A strong perimeter alone is not enough when devices connect from many places.",
    example:
      "A managed laptop enforces disk encryption, screen lock, and current updates before it can access company data.",
    category: "Operating System Security",
    difficulty: "Intermediate",
    keywords: ["endpoint security", "device protection", "edr"],
    relatedTerms: ["antivirus-software", "full-disk-encryption", "system-hardening", "zero-trust"],
    lessonSlugs: ["safe-browsing-habits"],
  },
  {
    id: "sandboxing",
    term: "Sandboxing",
    definition:
      "Running code in an isolated environment so it cannot affect the rest of the system.",
    explanation:
      "A sandbox limits what a program can read, change, or reach. It reduces the harm from untrusted or exploited code.",
    example:
      "A browser runs each website's scripts in a sandbox so a malicious page cannot freely access the rest of the machine.",
    category: "Operating System Security",
    difficulty: "Intermediate",
    keywords: ["sandbox", "isolation", "containment"],
    relatedTerms: ["malware", "attack-surface", "defense-in-depth"],
    lessonSlugs: [],
  },
  {
    id: "full-disk-encryption",
    term: "Full-disk encryption",
    definition:
      "Encrypting an entire storage device so its contents cannot be read without the correct key or password.",
    explanation:
      "It protects data if a device is lost or stolen. The benefit depends on a strong unlock method, since a weak login could still expose the data.",
    example:
      "A stolen laptop's drive is unreadable because it is encrypted and requires the owner's passcode to unlock.",
    category: "Operating System Security",
    difficulty: "Intermediate",
    keywords: ["full-disk encryption", "bitlocker", "filevault", "data at rest"],
    relatedTerms: ["encryption", "endpoint-security", "personal-data", "system-hardening"],
    lessonSlugs: [],
  },
  {
    id: "privilege-escalation",
    term: "Privilege escalation",
    definition:
      "Gaining a higher level of access than intended, such as moving from a normal user to administrator.",
    explanation:
      "Attackers escalate privileges to reach sensitive data or take over a system. Least privilege and prompt patching make escalation harder.",
    example:
      "A flaw in an installed program lets a normal user run commands as the administrator.",
    category: "Operating System Security",
    difficulty: "Advanced",
    keywords: ["privilege escalation", "admin access", "escalation"],
    relatedTerms: ["principle-of-least-privilege", "vulnerability", "exploit", "system-hardening"],
    lessonSlugs: [],
  },
  {
    id: "system-hardening",
    term: "System hardening",
    definition:
      "Reducing a system's attack surface by disabling unneeded features and applying secure settings.",
    explanation:
      "Hardening removes or closes things that are not required, such as unused services, accounts, and ports. It lowers the number of ways an attacker could get in.",
    example:
      "A server disables unused services and remote features so fewer entry points remain open.",
    category: "Operating System Security",
    difficulty: "Intermediate",
    keywords: ["hardening", "secure configuration", "reduce attack surface"],
    relatedTerms: ["attack-surface", "patch-management", "principle-of-least-privilege", "sandboxing"],
    lessonSlugs: [],
  },

  // Security Operations and Incident Response
  {
    id: "security-operations-centre",
    term: "Security operations centre (SOC)",
    definition:
      "A team and set of tools that monitor, detect, and respond to security events.",
    explanation:
      "A SOC watches alerts from many systems and investigates suspicious activity. It relies on logging, monitoring tools, and clear response procedures.",
    example:
      "A SOC analyst reviews an alert about unusual sign-in activity and starts an investigation.",
    category: "Security Operations and Incident Response",
    difficulty: "Intermediate",
    keywords: ["soc", "security operations", "monitoring", "detection"],
    relatedTerms: ["siem", "incident-response", "intrusion-detection-system", "log"],
    lessonSlugs: ["reporting-suspicious-activity"],
  },
  {
    id: "incident-response",
    term: "Incident response",
    definition:
      "The organised process of handling a security incident, from detection through recovery.",
    explanation:
      "A common sequence is prepare, detect and analyse, contain, eradicate, recover, and learn. Following a plan reduces confusion and damage during a stressful event.",
    example:
      "After ransomware is found, a team isolates affected systems, removes the malware, restores from backups, and reviews what happened.",
    category: "Security Operations and Incident Response",
    difficulty: "Intermediate",
    keywords: ["incident response", "ir", "containment", "recovery"],
    relatedTerms: [
      "incident-response-plan",
      "security-operations-centre",
      "ransomware",
      "digital-forensics",
      "post-incident-review",
    ],
    lessonSlugs: ["reporting-suspicious-activity"],
  },
  {
    id: "incident-response-plan",
    term: "Incident response plan",
    definition:
      "A documented set of roles, steps, and contacts for handling security incidents.",
    explanation:
      "The plan defines who does what and how to communicate when something happens. Practising it through exercises makes the real response faster.",
    example:
      "A plan lists who to contact, how to isolate systems, and how to notify affected parties for different incident types.",
    category: "Security Operations and Incident Response",
    difficulty: "Intermediate",
    keywords: ["incident response plan", "playbook", "preparedness"],
    relatedTerms: ["incident-response", "security-operations-centre", "post-incident-review"],
    lessonSlugs: ["reporting-suspicious-activity"],
  },
  {
    id: "indicator-of-compromise",
    term: "Indicator of compromise (IoC)",
    definition:
      "Evidence suggesting a system may have been breached, such as unusual files, addresses, or activity.",
    explanation:
      "IoCs help teams spot and hunt for intrusions. They are clues, not proof, and can become outdated as attackers change behaviour.",
    example:
      "A strange outbound connection to an unknown server is logged as an indicator of possible compromise.",
    category: "Security Operations and Incident Response",
    difficulty: "Intermediate",
    keywords: ["ioc", "indicator of compromise", "sign of intrusion"],
    relatedTerms: ["threat-intelligence", "incident-response", "log", "digital-forensics"],
    lessonSlugs: [],
  },
  {
    id: "threat-intelligence",
    term: "Threat intelligence",
    definition:
      "Information about known threats and attackers that helps organisations anticipate and detect attacks.",
    explanation:
      "It can include reports on tactics, campaigns, and indicators. Its value depends on relevance and reliability; unverified information can mislead.",
    example:
      "A threat report warns of a campaign targeting a sector, prompting teams to watch for related activity.",
    category: "Security Operations and Incident Response",
    difficulty: "Advanced",
    keywords: ["threat intelligence", "cti", "threat data"],
    relatedTerms: ["indicator-of-compromise", "security-operations-centre", "vulnerability-management"],
    lessonSlugs: [],
  },
  {
    id: "log",
    term: "Log",
    definition:
      "A record of events that a system or application produces, used to understand and investigate activity.",
    explanation:
      "Logs provide the evidence for detection and response, including who did what and when. They should be protected, retained appropriately, and reviewed.",
    example:
      "Authentication logs show repeated failed sign-ins followed by a success, suggesting a password-guessing attempt.",
    category: "Security Operations and Incident Response",
    difficulty: "Beginner",
    keywords: ["log", "logging", "audit trail", "event record"],
    relatedTerms: ["siem", "security-operations-centre", "digital-forensics", "password-spraying"],
    lessonSlugs: [],
  },
  {
    id: "digital-forensics",
    term: "Digital forensics",
    definition:
      "The process of collecting and analysing digital evidence to understand what happened in an incident.",
    explanation:
      "Investigators preserve evidence carefully so it remains reliable and admissible. The findings help confirm the scope of an incident and support response and recovery.",
    example:
      "Analysts examine a compromised machine's disk image to determine how an attacker gained access.",
    category: "Security Operations and Incident Response",
    difficulty: "Advanced",
    keywords: ["digital forensics", "evidence", "investigation"],
    relatedTerms: ["incident-response", "indicator-of-compromise", "log"],
    lessonSlugs: [],
  },
  {
    id: "siem",
    term: "SIEM",
    definition:
      "Security information and event management: a system that collects and correlates logs to detect and investigate threats.",
    explanation:
      "A SIEM brings together data from many sources and can raise alerts on patterns. It supports a SOC but still depends on good logging and human judgement.",
    example:
      "A SIEM correlates firewall, endpoint, and sign-in logs and flags a login from an unexpected country.",
    category: "Security Operations and Incident Response",
    difficulty: "Advanced",
    keywords: ["siem", "log correlation", "event management"],
    relatedTerms: ["log", "security-operations-centre", "intrusion-detection-system"],
    lessonSlugs: [],
  },
  {
    id: "security-triage",
    term: "Security triage",
    definition:
      "Quickly assessing and prioritising alerts or incidents to decide what needs attention first.",
    explanation:
      "Triage separates likely real events from noise and ranks them by impact. It helps teams focus effort where it matters most.",
    example:
      "An analyst marks a low-risk scanner alert as benign and escalates a confirmed account takeover for immediate action.",
    category: "Security Operations and Incident Response",
    difficulty: "Intermediate",
    keywords: ["triage", "prioritisation", "alert handling"],
    relatedTerms: ["security-operations-centre", "incident-response", "log"],
    lessonSlugs: [],
  },
  {
    id: "post-incident-review",
    term: "Post-incident review",
    definition:
      "A structured look back after an incident to find what worked, what failed, and how to improve.",
    explanation:
      "The review focuses on learning rather than blame, and produces concrete improvements. It closes the loop so similar incidents are handled better.",
    example:
      "After a phishing incident, a team updates training and adds a technical control following the review's findings.",
    category: "Security Operations and Incident Response",
    difficulty: "Intermediate",
    keywords: ["post-incident review", "lessons learned", "after action"],
    relatedTerms: ["incident-response", "incident-response-plan", "cyber-hygiene"],
    lessonSlugs: ["reporting-suspicious-activity"],
  },

  // Cybersecurity Standards and Concepts
  {
    id: "cia-triad",
    term: "CIA triad",
    definition:
      "The three core goals of information security: confidentiality, integrity, and availability.",
    explanation:
      "Confidentiality keeps data private, integrity keeps it accurate and unaltered, and availability keeps it accessible when needed. Security decisions often trade off between them.",
    example:
      "Encryption supports confidentiality, checksums support integrity, and backups and DDoS protection support availability.",
    category: "Cybersecurity Standards and Concepts",
    difficulty: "Beginner",
    keywords: ["cia triad", "confidentiality", "integrity", "availability"],
    relatedTerms: ["encryption", "hashing", "denial-of-service", "risk"],
    lessonSlugs: [],
  },
  {
    id: "vulnerability",
    term: "Vulnerability",
    definition:
      "A weakness in software, configuration, or process that could be used to cause harm.",
    explanation:
      "A vulnerability is the weakness itself; an exploit is the method used to take advantage of it. Many vulnerabilities have fixes available through updates.",
    example:
      "An outdated library with a known flaw leaves a web application vulnerable until it is updated.",
    category: "Cybersecurity Standards and Concepts",
    difficulty: "Beginner",
    keywords: ["vulnerability", "weakness", "flaw"],
    relatedTerms: [
      "exploit",
      "patch-management",
      "common-vulnerabilities-and-exposures",
      "vulnerability-management",
      "zero-day-vulnerability",
    ],
    lessonSlugs: [],
  },
  {
    id: "exploit",
    term: "Exploit",
    definition:
      "A technique or piece of code that takes advantage of a vulnerability to cause an effect.",
    explanation:
      "An exploit turns a weakness into a working attack, which may deliver malware or grant access. Removing the underlying vulnerability through patching is the durable fix.",
    example:
      "A crafted file exploits a flaw in a media player to run harmful code when opened.",
    category: "Cybersecurity Standards and Concepts",
    difficulty: "Intermediate",
    keywords: ["exploit", "attack code", "take advantage"],
    relatedTerms: ["vulnerability", "malware", "zero-day-vulnerability", "attack-vector"],
    lessonSlugs: [],
  },
  {
    id: "attack-vector",
    term: "Attack vector",
    definition:
      "The path or method an attacker uses to reach a target, such as email, a website, or a network service.",
    explanation:
      "Different vectors require different defences. Mapping them helps an organisation decide where to focus controls.",
    example:
      "Email is a common attack vector, which is why attachments and links receive particular scrutiny.",
    category: "Cybersecurity Standards and Concepts",
    difficulty: "Beginner",
    keywords: ["attack vector", "entry point", "path"],
    relatedTerms: ["attack-surface", "phishing", "exploit", "system-hardening"],
    lessonSlugs: ["introduction-to-phishing"],
  },
  {
    id: "attack-surface",
    term: "Attack surface",
    definition:
      "The total set of points where an attacker could try to enter or affect a system.",
    explanation:
      "Every exposed service, account, and interface adds to the attack surface. Reducing it through hardening and removing unused features lowers risk.",
    example:
      "Adding more internet-facing services increases the attack surface and the number of things to secure.",
    category: "Cybersecurity Standards and Concepts",
    difficulty: "Intermediate",
    keywords: ["attack surface", "exposure", "entry points"],
    relatedTerms: ["system-hardening", "attack-vector", "sandboxing", "network-segmentation"],
    lessonSlugs: [],
  },
  {
    id: "defense-in-depth",
    term: "Defense in depth",
    definition:
      "Using several independent layers of security so that a single failure does not lead to compromise.",
    explanation:
      "No single control is perfect, so overlapping layers reduce overall risk. If one layer is bypassed, others still provide protection.",
    example:
      "A service combines MFA, least privilege, monitoring, and patches so one weakness is not enough to breach it.",
    category: "Cybersecurity Standards and Concepts",
    difficulty: "Intermediate",
    keywords: ["defense in depth", "layered security", "multiple controls"],
    relatedTerms: ["principle-of-least-privilege", "zero-trust", "sandboxing", "content-security-policy"],
    lessonSlugs: [],
  },
  {
    id: "common-vulnerabilities-and-exposures",
    term: "Common Vulnerabilities and Exposures (CVE)",
    definition:
      "A public list that gives each known security vulnerability a unique identifier.",
    explanation:
      "CVE ids let people refer to the same flaw consistently across tools and reports. A CVE entry identifies the issue but is not a scoring of how severe it is.",
    example:
      "A bulletin references a CVE id so teams can look up details and check whether their software is affected.",
    category: "Cybersecurity Standards and Concepts",
    difficulty: "Intermediate",
    keywords: ["cve", "vulnerability id", "public identifier"],
    relatedTerms: ["vulnerability", "cvss", "patch-management", "vulnerability-management"],
    lessonSlugs: [],
  },
  {
    id: "cvss",
    term: "CVSS",
    definition:
      "The Common Vulnerability Scoring System, a standard method for rating the severity of a vulnerability.",
    explanation:
      "CVSS produces a numeric score based on factors such as exploitability and impact. The score is a guide, and real-world risk also depends on context.",
    example:
      "A team prioritises a high-scoring flaw that is easy to exploit over a low-scoring one on an isolated system.",
    category: "Cybersecurity Standards and Concepts",
    difficulty: "Advanced",
    keywords: ["cvss", "severity score", "vulnerability rating"],
    relatedTerms: ["common-vulnerabilities-and-exposures", "vulnerability", "risk"],
    lessonSlugs: [],
  },
  {
    id: "risk",
    term: "Risk",
    definition:
      "The potential for loss or harm, often considered as the combination of a threat, a vulnerability, and the impact if it occurs.",
    explanation:
      "Risk assessment helps decide where to spend effort, since not every threat is equally likely or damaging. It balances likelihood against impact.",
    example:
      "A vulnerability on an internet-facing server is treated as higher risk than the same flaw on an offline test machine.",
    category: "Cybersecurity Standards and Concepts",
    difficulty: "Beginner",
    keywords: ["risk", "likelihood", "impact", "threat"],
    relatedTerms: ["vulnerability", "threat-intelligence", "cvss", "cia-triad"],
    lessonSlugs: [],
  },
  {
    id: "zero-day-vulnerability",
    term: "Zero-day vulnerability",
    definition:
      "A flaw that is exploited before the vendor has released a fix.",
    explanation:
      "Because no patch exists yet, defenders must rely on other layers until a fix is available. The term describes the timing, not necessarily the severity.",
    example:
      "Attackers exploit a newly discovered flaw days before the software maker issues an update.",
    category: "Cybersecurity Standards and Concepts",
    difficulty: "Intermediate",
    keywords: ["zero-day", "0day", "unpatched", "unknown vulnerability"],
    relatedTerms: ["vulnerability", "exploit", "patch-management", "defense-in-depth"],
    lessonSlugs: [],
  },
  {
    id: "vulnerability-management",
    term: "Vulnerability management",
    definition:
      "The ongoing process of finding, prioritising, and fixing vulnerabilities across an organisation.",
    explanation:
      "It combines scanning, assessment, and remediation over time. Priorities should reflect real risk, not just raw severity scores.",
    example:
      "A team scans its systems, ranks findings by risk, and tracks fixes to completion.",
    category: "Cybersecurity Standards and Concepts",
    difficulty: "Intermediate",
    keywords: ["vulnerability management", "scanning", "remediation"],
    relatedTerms: ["vulnerability", "common-vulnerabilities-and-exposures", "cvss", "patch-management"],
    lessonSlugs: [],
  },
  {
    id: "cyber-hygiene",
    term: "Cyber hygiene",
    definition:
      "The everyday practices that keep devices and accounts reasonably secure, such as updates and strong passwords.",
    explanation:
      "Good hygiene covers basics like patching, unique passwords, MFA, and backups. These habits prevent many common incidents without specialised tools.",
    example:
      "Enabling automatic updates and multi-factor authentication on important accounts is basic cyber hygiene.",
    category: "Cybersecurity Standards and Concepts",
    difficulty: "Beginner",
    keywords: ["cyber hygiene", "good practice", "basics"],
    relatedTerms: ["patch-management", "multi-factor-authentication", "password-manager", "system-hardening"],
    lessonSlugs: ["safe-browsing-habits", "password-and-account-security"],
  },
];
