import { analyzeUrl } from "./analyzeUrl";

function anatomyOf(input: string) {
  const { anatomy } = analyzeUrl(input);
  if (!anatomy) throw new Error(`Expected anatomy for ${input}`);
  return anatomy;
}

describe("URL anatomy", () => {
  it("breaks a full URL into its structural components", () => {
    const anatomy = anatomyOf(
      "https://login.accounts.example.com/settings/profile?tab=security&lang=en#section",
    );

    expect(anatomy.protocol).toBe("https:");
    expect(anatomy.hasAuthority).toBe(true);
    expect(anatomy.hostname).toBe("login.accounts.example.com");
    expect(anatomy.subdomain).toBe("login.accounts");
    expect(anatomy.registrableDomain).toBe("example.com");
    expect(anatomy.port).toBe("");
    expect(anatomy.path).toBe("/settings/profile");
    expect(anatomy.hasQuery).toBe(true);
    expect(anatomy.queryParameterNames).toEqual(["tab", "lang"]);
    expect(anatomy.hasFragment).toBe(true);
  });

  it("exposes only query parameter names, never values", () => {
    const anatomy = anatomyOf(
      "https://example.com/callback?access_token=very-secret&page=2",
    );

    expect(anatomy.queryParameterNames).toEqual(["access_token", "page"]);
  });

  it("reports an approximate registrable domain and no subdomain for bare hosts", () => {
    const anatomy = anatomyOf("https://example.com/");

    expect(anatomy.subdomain).toBe("");
    expect(anatomy.registrableDomain).toBe("example.com");
    expect(anatomy.path).toBe("/");
    expect(anatomy.hasQuery).toBe(false);
    expect(anatomy.hasFragment).toBe(false);
  });

  it.each([
    ["IPv4", "https://192.0.2.8/path"],
    ["IPv6 with port", "https://[2001:db8::1]:8443/"],
  ])("marks an %s host as an IP literal", (_label, input) => {
    const anatomy = anatomyOf(input);
    expect(anatomy.isIpHost).toBe(true);
    expect(anatomy.subdomain).toBe("");
  });

  it("reports port only when it is not the scheme default", () => {
    expect(anatomyOf("https://example.com:443/").port).toBe("");
    expect(anatomyOf("https://example.com:8443/").port).toBe("8443");
  });

  it("flags punycode and Unicode input separately", () => {
    const punycode = anatomyOf("https://xn--pple-43d.com/login");
    const unicode = anatomyOf("https://раypal.com/");

    expect(punycode.isPunycode).toBe(true);
    expect(punycode.hasUnicodeInput).toBe(false);
    expect(unicode.isPunycode).toBe(true);
    expect(unicode.hasUnicodeInput).toBe(true);
  });

  it("counts percent-encoded octets and reports character length", () => {
    const anatomy = anatomyOf("https://example.com/%41%42%43");

    expect(anatomy.percentEncodedOctets).toBe(3);
    expect(anatomy.characterLength).toBe("https://example.com/%41%42%43".length);
  });

  it("does not build anatomy for input that cannot be parsed", () => {
    expect(analyzeUrl("example.com").anatomy).toBeNull();
    expect(analyzeUrl("https://").anatomy).toBeNull();
    expect(analyzeUrl("").anatomy).toBeNull();
  });
});
