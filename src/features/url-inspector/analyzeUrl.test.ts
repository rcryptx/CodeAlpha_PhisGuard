import { analyzeUrl, urlSafetyDisclaimer } from "./analyzeUrl";

describe("analyzeUrl", () => {
  it("finds no obvious structural indicators in a typical HTTPS URL", () => {
    const result = analyzeUrl("https://www.example.com/about");

    expect(result.risk).toBe("no-obvious-indicators");
    expect(result.findings).toEqual([]);
    expect(result.hostname).toBe("www.example.com");
    expect(urlSafetyDisclaimer).toContain(
      "does not guarantee that a URL is safe",
    );
  });

  it("flags HTTP without treating HTTPS as proof that a site is safe", () => {
    const result = analyzeUrl("http://example.com");

    expect(result.risk).toBe("suspicious");
    expect(result.findings.map(({ ruleId }) => ruleId)).toContain(
      "unencrypted-http",
    );
    expect(analyzeUrl("https://example.com").risk).toBe(
      "no-obvious-indicators",
    );
  });

  it.each([
    ["IPv4", "https://192.0.2.8/path"],
    ["IPv4 shorthand normalized by URL parser", "http://127.1/"],
    ["IPv6", "https://[2001:db8::1]/"],
  ])("detects an %s hostname", (_label, input) => {
    const result = analyzeUrl(input);

    expect(result.findings.map(({ ruleId }) => ruleId)).toContain(
      "ip-address-hostname",
    );
  });

  it("detects IPv6 loopback but rejects a malformed IPv4 address as invalid", () => {
    expect(analyzeUrl("http://[::1]:8080/").findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "ip-address-hostname" }),
        expect.objectContaining({ ruleId: "nonstandard-port" }),
      ]),
    );
    expect(analyzeUrl("https://999.999.999.999/").risk).toBe("invalid-url");
  });

  it("detects an ASCII punycode hostname", () => {
    const result = analyzeUrl("https://xn--pple-43d.com/login");

    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "punycode-hostname" }),
      ]),
    );
  });

  it("detects Unicode hostnames and reports their parsed ASCII form", () => {
    const result = analyzeUrl("https://раypal.com/");
    const finding = result.findings.find(
      ({ ruleId }) => ruleId === "unicode-hostname",
    );

    expect(finding).toBeDefined();
    expect(finding?.evidence).toContain("xn--");
  });

  it("detects misleading brand-shaped subdomains and account-action labels", () => {
    const misleading = analyzeUrl("https://paypal.com.account-check.example/");
    const impersonation = analyzeUrl("https://paypal-login.example.net/");

    expect(misleading.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: "brand-domain-in-subdomain",
          severity: "high",
        }),
      ]),
    );
    expect(impersonation.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "brand-action-hostname" }),
      ]),
    );
  });

  it("detects deeply nested subdomains without flagging ordinary subdomains", () => {
    const deep = analyzeUrl("https://one.two.three.four.five.example.com/");
    const ordinary = analyzeUrl("https://docs.example.com/");

    expect(deep.findings.map(({ ruleId }) => ruleId)).toContain(
      "deep-subdomain",
    );
    expect(ordinary.findings).toEqual([]);
  });

  it("detects embedded credentials without exposing their values", () => {
    const result = analyzeUrl("https://alice:secret@example.com/private");
    const finding = result.findings.find(
      ({ ruleId }) => ruleId === "embedded-credentials",
    );

    expect(finding).toBeDefined();
    expect(finding?.evidence).not.toContain("alice");
    expect(finding?.evidence).not.toContain("secret");
    expect(result.normalizedUrl).not.toContain("alice");
    expect(result.normalizedUrl).not.toContain("private");
  });

  it("detects empty user information markers without exposing the authority", () => {
    const result = analyzeUrl("https://@example.com/");

    expect(result.findings.map(({ ruleId }) => ruleId)).toContain(
      "embedded-credentials",
    );
    expect(result.normalizedUrl).toBe("https://example.com");
  });

  it("detects multiple @ characters in the authority", () => {
    const result = analyzeUrl("https://first@second@evil.example/");

    expect(result.findings.map(({ ruleId }) => ruleId)).toContain(
      "multiple-at-signs",
    );
  });

  it("detects non-default ports and leaves default ports unflagged", () => {
    expect(analyzeUrl("https://example.com:8443/").findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "nonstandard-port" }),
      ]),
    );
    expect(analyzeUrl("https://example.com:443/").findings).toEqual([]);
    expect(
      analyzeUrl("http://example.com:80/").findings.map(({ ruleId }) => ruleId),
    ).toEqual(["unencrypted-http"]);
  });

  it("classifies malformed inputs and unsupported schemes separately", () => {
    for (const input of ["", "example.com", "https://", "https://[::1"]) {
      expect(analyzeUrl(input).risk).toBe("invalid-url");
    }

    const unsupported = analyzeUrl("javascript:alert(1)");
    expect(unsupported.risk).toBe("high-concern");
    expect(unsupported.findings).toEqual([
      expect.objectContaining({
        ruleId: "unsupported-scheme",
        severity: "high",
      }),
    ]);
    expect(unsupported.normalizedUrl).toBe("javascript:[destination omitted]");
    expect(analyzeUrl("ftp://files.example.com/archive").risk).toBe(
      "suspicious",
    );
  });

  it("detects unusually long URLs", () => {
    const longUrl = `https://example.com/${"a".repeat(2050)}`;
    const result = analyzeUrl(longUrl);

    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "long-url", severity: "medium" }),
      ]),
    );
  });

  it("detects dense encoding, encoded controls, and malformed escapes", () => {
    const dense = analyzeUrl(`https://example.com/${"%41".repeat(12)}`);
    const control = analyzeUrl("https://example.com/path/%0d%0a");
    const malformed = analyzeUrl("https://example.com/path/%GG");

    expect(dense.findings.map(({ ruleId }) => ruleId)).toContain(
      "dense-url-encoding",
    );
    expect(control.findings.map(({ ruleId }) => ruleId)).toContain(
      "encoded-control-or-separator",
    );
    expect(malformed.findings.map(({ ruleId }) => ruleId)).toContain(
      "malformed-percent-encoding",
    );
  });

  it("detects sensitive query parameter names without exposing values", () => {
    const result = analyzeUrl(
      "https://example.com/callback?access_token=very-secret-value",
    );
    const finding = result.findings.find(
      ({ ruleId }) => ruleId === "sensitive-query-parameter",
    );

    expect(finding?.evidence).toContain("access_token");
    expect(finding?.evidence).not.toContain("very-secret-value");
    expect(result.normalizedUrl).not.toContain("very-secret-value");
  });

  it("detects external redirect destinations without displaying their query values", () => {
    const result = analyzeUrl(
      "https://example.com/continue?next=https%3A%2F%2Foutside.example%2Fpath",
    );

    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: "external-redirect-parameter",
          evidence: expect.stringContaining("outside.example"),
        }),
      ]),
    );
    expect(result.normalizedUrl).not.toContain("outside.example");
  });

  it("avoids common false positives for ordinary service URLs and encoded spaces", () => {
    const legitimateServiceUrl = analyzeUrl(
      "https://login.paypal.com/signin?redirect=https%3A%2F%2Flogin.paypal.com%2Faccount",
    );
    const encodedSpace = analyzeUrl(
      "https://docs.example.com/search?q=hello%20world",
    );

    expect(legitimateServiceUrl.findings).toEqual([]);
    expect(encodedSpace.findings).toEqual([]);
  });

  it("derives risk categories only from findings", () => {
    expect(analyzeUrl("https://example.com").risk).toBe(
      "no-obvious-indicators",
    );
    expect(analyzeUrl("https://example.com:8443").risk).toBe("low-concern");
    expect(analyzeUrl("http://example.com").risk).toBe("suspicious");
    expect(analyzeUrl("https://user:pass@example.com").risk).toBe(
      "high-concern",
    );
  });

  it("attaches a structural anatomy to parsed URLs and none to invalid input", () => {
    const parsed = analyzeUrl("https://docs.example.com/guide?lang=en");

    expect(parsed.anatomy).not.toBeNull();
    expect(parsed.anatomy?.subdomain).toBe("docs");
    expect(parsed.anatomy?.registrableDomain).toBe("example.com");
    expect(parsed.anatomy?.queryParameterNames).toEqual(["lang"]);
    expect(analyzeUrl("example.com").anatomy).toBeNull();
  });

  it("provides a limitation for every structural finding", () => {
    const samples = [
      "http://example.com:8080/?redirect=https%3A%2F%2Foutside.example%2F",
      "https://alice:secret@example.com/private",
      "javascript:alert(1)",
      "https://xn--pple-43d.com/login",
      "https://202.10.10.10/path",
    ];

    for (const sample of samples) {
      for (const finding of analyzeUrl(sample).findings) {
        expect(finding.limitation.length).toBeGreaterThan(0);
      }
    }
  });
});
