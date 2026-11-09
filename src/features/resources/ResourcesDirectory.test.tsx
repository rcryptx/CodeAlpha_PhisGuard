import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { ResourcesDirectory } from "./ResourcesDirectory";

describe("resources directory", () => {
  it("renders official resources with safe external link handling and related lessons", () => {
    render(
      <MemoryRouter>
        <ResourcesDirectory />
      </MemoryRouter>,
    );

    const phishingLink = screen.getByRole("link", {
      name: /Recognize and report phishing/,
    });
    expect(phishingLink).toHaveAttribute(
      "href",
      "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing",
    );
    expect(phishingLink).toHaveAttribute("target", "_blank");
    expect(phishingLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.getByRole("link", { name: "Introduction to phishing" }),
    ).toHaveAttribute("href", "/learn/introduction-to-phishing");
    expect(screen.getAllByText("External source").length).toBeGreaterThan(0);
    expect(screen.getAllByText("On PhisGuard").length).toBeGreaterThan(0);
  });

  it("filters resources by category and search", () => {
    render(
      <MemoryRouter>
        <ResourcesDirectory />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Account security" }));
    expect(
      screen.getByRole("link", { name: /Turn on multifactor authentication/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Recognize and report phishing/ }),
    ).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search resources" }),
      {
        target: { value: "password" },
      },
    );
    expect(
      screen.getByRole("link", { name: /Use strong passwords/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: /Turn on multifactor authentication/,
      }),
    ).not.toBeInTheDocument();
  });

  it("renders helpful empty and invalid-data states", () => {
    const { rerender } = render(
      <MemoryRouter>
        <ResourcesDirectory catalog={[]} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "No resources are available" }),
    ).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <ResourcesDirectory catalog={[null]} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Some resource entries were omitted",
    );
    expect(
      screen.getByRole("heading", { name: "No resources are available" }),
    ).toBeInTheDocument();
  });

  it("announces search results and exposes category selection state", () => {
    render(
      <MemoryRouter>
        <ResourcesDirectory />
      </MemoryRouter>,
    );
    const filters = screen.getByRole("group", {
      name: "Filter resources by category",
    });
    expect(
      within(filters).getByRole("button", { name: "All" }),
    ).toHaveAttribute("aria-pressed", "true");

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search resources" }),
      {
        target: { value: "no-such-resource" },
      },
    );
    expect(screen.getByText("0 resources")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "No matching resources" }),
    ).toBeInTheDocument();
  });
});
