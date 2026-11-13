import { analyzeUrl } from "./analyzeUrl";
import { buildUrlReport } from "./report";

describe("buildUrlReport", () => {
  it("includes the structural breakdown and risk label", () => {
    const report = buildUrlReport(
      analyzeUrl("https://login.example.com/path?tab=security#section"),
    );

    expect(report).toContain("PhisGuard - URL analysis report");
    expect(report).toContain("Generated locally in the browser");
    expect(report).toContain("Subdomain: login");
    expect(report).toContain("Registrable domain (approximate): example.com");
    expect(report).toContain("Query parameters: tab");
    expect(report).toContain("Fragment: (present)");
    expect(report).toContain("Structural risk label:");
  });

  it("lists each finding with its explanation, limitation, and recommendation", () => {
    const report = buildUrlReport(analyzeUrl("http://example.com"));

    expect(report).toContain("Findings (1):");
    expect(report).toContain("Connection is not encrypted by HTTPS");
    expect(report).toContain("Explanation:");
    expect(report).toContain("Limitation:");
    expect(report).toContain("Recommendation:");
    expect(report).toContain("Limitations of this analysis:");
  });

  it("omits user information and query values from the report", () => {
    const report = buildUrlReport(
      analyzeUrl("https://alice:secret@example.com/reset?access_token=zzz"),
    );

    expect(report).not.toContain("alice");
    expect(report).not.toContain("secret");
    expect(report).not.toContain("zzz");
    expect(report).toContain("access_token");
  });

  it("does not echo unparsed input in the report", () => {
    const report = buildUrlReport(analyzeUrl("example.com"));

    expect(report).toContain("input could not be parsed");
    expect(report).toContain("Result: input could not be analyzed");
  });

  it("always states that the analysis never made a network request", () => {
    const report = buildUrlReport(analyzeUrl("https://example.com/"));
    expect(report).toContain("No network requests were made.");
  });
});
