import type { UrlAnatomy, UrlFinding } from "./types";

type ComponentKey =
  | "protocol"
  | "userinfo"
  | "subdomain"
  | "domain"
  | "port"
  | "path"
  | "query"
  | "fragment";

interface AnatomyPart {
  key: ComponentKey;
  label: string;
  value: string;
  caption: string;
  ruleIds: string[];
}

const componentRuleIds: Record<ComponentKey, string[]> = {
  protocol: ["unencrypted-http", "unsupported-scheme"],
  userinfo: ["embedded-credentials", "multiple-at-signs"],
  subdomain: [
    "deep-subdomain",
    "brand-domain-in-subdomain",
    "brand-action-hostname",
    "punycode-hostname",
    "unicode-hostname",
    "ip-address-hostname",
  ],
  domain: [
    "ip-address-hostname",
    "punycode-hostname",
    "unicode-hostname",
    "brand-domain-in-subdomain",
    "brand-action-hostname",
  ],
  port: ["nonstandard-port"],
  path: [
    "encoded-control-or-separator",
    "dense-url-encoding",
    "malformed-percent-encoding",
    "long-url",
  ],
  query: [
    "sensitive-query-parameter",
    "external-redirect-parameter",
    "encoded-control-or-separator",
    "dense-url-encoding",
    "malformed-percent-encoding",
    "long-url",
  ],
  fragment: [],
};

function describeQuery(anatomy: UrlAnatomy) {
  if (!anatomy.hasQuery) return "";
  if (anatomy.queryParameterNames.length === 0) return "? (unnamed)";
  return `?${anatomy.queryParameterNames.map((name) => `${name}=•••`).join("&")}`;
}

function buildParts(anatomy: UrlAnatomy): AnatomyPart[] {
  const parts: AnatomyPart[] = [
    {
      key: "protocol",
      label: "Protocol",
      value: anatomy.protocol,
      caption:
        "The scheme tells the browser how to reach the resource. https: encrypts the connection; http: does not.",
      ruleIds: componentRuleIds.protocol,
    },
    {
      key: "userinfo",
      label: "User info",
      value: "[hidden]",
      caption:
        "Text before an @ is user information. Browsers treat it specially, and it can hide the host that is actually contacted — read what follows the final @.",
      ruleIds: componentRuleIds.userinfo,
    },
    {
      key: "subdomain",
      label: "Subdomain",
      value: anatomy.subdomain,
      caption:
        "Labels before the registrable domain. They belong to the domain owner, but can be arranged to resemble another site.",
      ruleIds: componentRuleIds.subdomain,
    },
    {
      key: "domain",
      label: "Registrable domain",
      value: anatomy.registrableDomain,
      caption:
        "The final two hostname labels — the part most meaningful for ownership. Read the hostname from right to left.",
      ruleIds: componentRuleIds.domain,
    },
    {
      key: "port",
      label: "Port",
      value: anatomy.port ? `:${anatomy.port}` : "",
      caption:
        "A non-default port is common in developer and self-hosted services, but is worth confirming.",
      ruleIds: componentRuleIds.port,
    },
    {
      key: "path",
      label: "Path",
      value: anatomy.path,
      caption:
        "Identifies a resource on the server. It sits before the query and does not change which host is contacted.",
      ruleIds: componentRuleIds.path,
    },
    {
      key: "query",
      label: "Query",
      value: describeQuery(anatomy),
      caption:
        "Parameters after ?. Values are hidden here so tokens or personal data are not repeated on screen.",
      ruleIds: componentRuleIds.query,
    },
    {
      key: "fragment",
      label: "Fragment",
      value: anatomy.hasFragment ? "#(present)" : "",
      caption:
        "Text after # is handled by the page and is not sent to the server. It can still carry data.",
      ruleIds: componentRuleIds.fragment,
    },
  ];

  const hasValue: Record<ComponentKey, boolean> = {
    protocol: anatomy.protocol !== "",
    userinfo: anatomy.userinfoPresent,
    subdomain: anatomy.subdomain !== "",
    domain: anatomy.registrableDomain !== "",
    port: anatomy.port !== "",
    path: anatomy.path !== "" && anatomy.path !== "/",
    query: anatomy.hasQuery,
    fragment: anatomy.hasFragment,
  };

  return parts.filter((part) => hasValue[part.key]);
}

export function UrlAnatomyView({
  anatomy,
  findings,
}: {
  anatomy: UrlAnatomy;
  findings: UrlFinding[];
}) {
  const presentRuleIds = new Set(findings.map((finding) => finding.ruleId));
  const parts = buildParts(anatomy);
  const flaggedParts = parts.filter((part) =>
    part.ruleIds.some((ruleId) => presentRuleIds.has(ruleId)),
  );
  const relatedFindingCount = (part: AnatomyPart) =>
    findings.filter((finding) => part.ruleIds.includes(finding.ruleId)).length;

  return (
    <section aria-labelledby="anatomy-heading" className="mt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3
          id="anatomy-heading"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300"
        >
          URL anatomy
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {anatomy.characterLength.toLocaleString()} characters ·{" "}
          {anatomy.percentEncodedOctets} percent-encoded octets
        </p>
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Read the hostname from right to left: the registrable domain near the end
        is the part that identifies ownership. The breakdown below is
        descriptive, not a verdict.
      </p>

      <ol className="mt-4 flex flex-wrap items-stretch gap-2">
        {parts.map((part) => {
          const count = relatedFindingCount(part);
          return (
            <li
              key={part.key}
              className={`min-w-0 rounded-xl border px-3 py-2 ${
                count > 0
                  ? "border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-900"
                  : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
              }`}
            >
              <span className="flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                {part.label}
                {count > 0 && (
                  <span
                    aria-label={`${count} related ${
                      count === 1 ? "finding" : "findings"
                    }`}
                    className="inline-block h-1.5 w-1.5 rounded-full bg-slate-700 dark:bg-slate-300"
                  />
                )}
              </span>
              <span className="mt-1 block break-all font-mono text-sm text-slate-900 dark:text-slate-100">
                {part.value}
              </span>
            </li>
          );
        })}
      </ol>

      {flaggedParts.length > 0 && (
        <ul className="mt-4 space-y-2">
          {flaggedParts.map((part) => (
            <li
              key={part.key}
              className="border-l-2 border-slate-300 pl-3 text-sm leading-6 text-slate-600 dark:border-slate-600 dark:text-slate-300"
            >
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {part.label}:
              </span>{" "}
              {part.caption}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
