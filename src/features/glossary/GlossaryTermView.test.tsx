import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import { GlossaryTermPage } from "@/pages/GlossaryTermPage";

import { getGlossaryTerm } from "./glossaryData";
import { GLOSSARY_RECENT_KEY } from "./glossaryStorage";
import { clearBookmarks, clearRecentTerms } from "./glossaryStore";
import { GlossaryTermView } from "./GlossaryTermView";

describe("glossary term view", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearBookmarks();
    clearRecentTerms();
  });

  it("renders the definition, explanation, example, related terms, and lessons", () => {
    render(
      <MemoryRouter>
        <GlossaryTermView term={getGlossaryTerm("phishing")!} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Phishing" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/deceptive attempt/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "In plain language" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Example" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Spear phishing" })).toHaveAttribute(
      "href",
      "/glossary/spear-phishing",
    );
    expect(
      screen.getByRole("link", { name: "Introduction to phishing" }),
    ).toHaveAttribute("href", "/learn/introduction-to-phishing");
  });

  it("records the term as recently viewed", () => {
    render(
      <MemoryRouter>
        <GlossaryTermView term={getGlossaryTerm("phishing")!} />
      </MemoryRouter>,
    );
    expect(window.localStorage.getItem(GLOSSARY_RECENT_KEY)).toContain(
      "phishing",
    );
  });

  it("toggles the bookmark for the term", () => {
    render(
      <MemoryRouter>
        <GlossaryTermView term={getGlossaryTerm("phishing")!} />
      </MemoryRouter>,
    );
    const button = screen.getByRole("button", { name: "Bookmark this term" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(button);
    expect(
      screen.getByRole("button", { name: "Bookmarked" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});

describe("glossary term page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearBookmarks();
    clearRecentTerms();
  });

  it("renders a term resolved from the route", () => {
    render(
      <MemoryRouter initialEntries={["/glossary/phishing"]}>
        <Routes>
          <Route path="/glossary/:termId" element={<GlossaryTermPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Phishing" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Glossary" })).toHaveAttribute(
      "href",
      "/glossary",
    );
  });

  it("shows a not-found state for unknown terms", () => {
    render(
      <MemoryRouter initialEntries={["/glossary/unknown-term"]}>
        <Routes>
          <Route path="/glossary/:termId" element={<GlossaryTermPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Term not found" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to the glossary" }),
    ).toHaveAttribute("href", "/glossary");
  });
});
