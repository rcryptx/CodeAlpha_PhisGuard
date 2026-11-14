import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import { getGlossaryTerm } from "./glossaryData";
import { GlossaryDirectory } from "./GlossaryDirectory";
import {
  clearBookmarks,
  clearRecentTerms,
  recordTermView,
} from "./glossaryStore";

const catalog = ["phishing", "firewall", "zero-trust", "clickjacking"].map(
  (id) => getGlossaryTerm(id)!,
);

function renderDirectory(customCatalog: unknown = catalog) {
  return render(
    <MemoryRouter>
      <GlossaryDirectory catalog={customCatalog} />
    </MemoryRouter>,
  );
}

describe("glossary directory", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearBookmarks();
    clearRecentTerms();
  });

  it("renders valid terms with a live result count", () => {
    renderDirectory();
    expect(screen.getByRole("heading", { name: "Phishing" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Firewall" })).toBeInTheDocument();
    expect(screen.getByText("4 terms")).toBeInTheDocument();
  });

  it("filters by search query", () => {
    renderDirectory();
    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search glossary terms" }),
      { target: { value: "zero" } },
    );
    expect(
      screen.getByRole("heading", { name: "Zero trust" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Phishing" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("1 term")).toBeInTheDocument();
  });

  it("filters by category with pressed-state chips", () => {
    renderDirectory();
    const group = screen.getByRole("group", {
      name: "Filter glossary by category",
    });
    expect(within(group).getByRole("button", { name: /All/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(
      within(group).getByRole("button", { name: /Network Security/ }),
    );
    expect(within(group).getByRole("button", { name: /Network Security/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("heading", { name: "Firewall" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Zero trust" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Phishing" }),
    ).not.toBeInTheDocument();
  });

  it("filters by difficulty", () => {
    renderDirectory();
    const group = screen.getByRole("group", {
      name: "Filter glossary by difficulty",
    });
    fireEvent.click(within(group).getByRole("button", { name: "Advanced" }));
    expect(
      screen.getByRole("heading", { name: "Zero trust" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Clickjacking" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Firewall" }),
    ).not.toBeInTheDocument();
  });

  it("toggles bookmarks and filters to bookmarked terms", () => {
    renderDirectory();
    const bookmark = screen.getByRole("button", { name: "Bookmark Firewall" });
    expect(bookmark).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(bookmark);
    expect(
      screen.getByRole("button", { name: "Remove bookmark for Firewall" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: /Bookmarked only \(1\)/ }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Bookmarked only/ }));
    expect(screen.getByRole("heading", { name: "Firewall" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Phishing" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByRole("heading", { name: "Phishing" })).toBeInTheDocument();
  });

  it("sorts results with the sort control", () => {
    renderDirectory();
    const sort = screen.getByRole("combobox", { name: "Sort terms" });
    fireEvent.change(sort, { target: { value: "difficulty" } });

    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings[0]).toHaveTextContent("Firewall");
    expect(headings[headings.length - 1]).toHaveTextContent("Zero trust");
  });

  it("shows and clears recently viewed terms", () => {
    recordTermView("clickjacking");
    renderDirectory();

    const region = screen.getByRole("region", { name: "Recently viewed terms" });
    expect(
      within(region).getByRole("link", { name: "Clickjacking" }),
    ).toHaveAttribute("href", "/glossary/clickjacking");

    fireEvent.click(within(region).getByRole("button", { name: "Clear" }));
    expect(
      screen.queryByRole("region", { name: "Recently viewed terms" }),
    ).not.toBeInTheDocument();
  });

  it("renders empty and invalid-data states", () => {
    const { rerender } = render(
      <MemoryRouter>
        <GlossaryDirectory catalog={[]} />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "No glossary terms are available" }),
    ).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <GlossaryDirectory catalog={[null]} />
      </MemoryRouter>,
    );
    expect(
      screen.getByText(/Some glossary terms were omitted/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "No glossary terms are available" }),
    ).toBeInTheDocument();
  });
});
