import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "./App";
import { navItems } from "./config/site";
import { lessons } from "./features/learning/curriculum";

describe("PhisGuard routes", () => {
  it("renders the home page at the app root", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("PhisGuard").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Think Before You Click.").length,
    ).toBeGreaterThan(0);
    const inspectorLink = screen
      .getAllByRole("link", { name: /URL Inspector/ })
      .find((link) => link.textContent?.includes("Available now"));
    expect(inspectorLink).toBeDefined();
    expect(inspectorLink).toHaveAttribute("href", "/inspector");
    expect(inspectorLink).toHaveTextContent("Available now");
    const practiceLink = screen
      .getAllByRole("link", { name: /Practice Lab/ })
      .find((link) => link.textContent?.includes("Available now"));
    expect(practiceLink).toBeDefined();
    expect(practiceLink).toHaveAttribute("href", "/practice");
    expect(practiceLink).toHaveTextContent("Available now");
    const assessmentsLink = screen
      .getAllByRole("link", { name: /Assessments/ })
      .find((link) => link.textContent?.includes("Available now"));
    expect(assessmentsLink).toBeDefined();
    expect(assessmentsLink).toHaveAttribute("href", "/assessments");
    expect(assessmentsLink).toHaveTextContent("Available now");
    const progressLink = screen
      .getAllByRole("link", { name: /Progress/ })
      .find((link) => link.textContent?.includes("Available now"));
    expect(progressLink).toBeDefined();
    expect(progressLink).toHaveAttribute("href", "/progress");
    expect(progressLink).toHaveTextContent("Available now");
    const resourcesLink = screen
      .getAllByRole("link", { name: /Resources/ })
      .find((link) => link.textContent?.includes("Available now"));
    expect(resourcesLink).toBeDefined();
    expect(resourcesLink).toHaveAttribute("href", "/resources");
    expect(resourcesLink).toHaveTextContent("Available now");
  });

  it("renders a not found state for unknown routes", () => {
    render(
      <MemoryRouter initialEntries={["/unknown-route"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("renders every public route from navigation", () => {
    for (const item of navItems) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[item.to]}>
          <App />
        </MemoryRouter>,
      );

      expect(screen.queryByText("Page not found")).not.toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
      unmount();
    }
  });

  it("integrates the local URL inspector at its public route", () => {
    render(
      <MemoryRouter initialEntries={["/inspector"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "URL Inspector" }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "URL to analyze" }), {
      target: { value: "https://example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze URL" }));

    expect(
      screen.getByRole("heading", {
        name: "No obvious structural indicators detected",
      }),
    ).toBeInTheDocument();
  });

  it("integrates the Resources library and ZYNX information page", () => {
    const resources = render(
      <MemoryRouter initialEntries={["/resources"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "Learning resources" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Recognize and report phishing/ }),
    ).toHaveAttribute(
      "href",
      "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing",
    );
    resources.unmount();

    render(
      <MemoryRouter initialEntries={["/zynx"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "ZYNX" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open ZYNX assistant" }),
    ).toBeInTheDocument();
  });

  it("integrates the interactive Practice Lab at its public route", () => {
    render(
      <MemoryRouter initialEntries={["/practice"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Practice Lab" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Choose a scenario" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Start scenario: An urgent account check/,
      }),
    ).toBeInTheDocument();
  });

  it("integrates the assessment selection at its public route", () => {
    render(
      <MemoryRouter initialEntries={["/assessments"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Assessments" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Full assessment" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Start full assessment" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Start topic assessment: Introduction to phishing",
      }),
    ).toBeInTheDocument();
  });

  it("renders a lesson at its stable URL with working next-lesson navigation", () => {
    render(
      <MemoryRouter initialEntries={["/learn/introduction-to-phishing"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Introduction to phishing",
      }),
    ).toBeInTheDocument();
    const lessonNavigation = screen.getByRole("navigation", {
      name: "Lesson navigation",
    });
    const nextLessonLink = within(lessonNavigation).getByRole("link", {
      name: /Next lesson/,
    });
    expect(nextLessonLink).toHaveAttribute("href", "/learn/email-phishing");
    fireEvent.click(nextLessonLink);
    expect(
      screen.getByRole("heading", { level: 1, name: "Email phishing" }),
    ).toBeInTheDocument();

    expect(
      within(lessonNavigation).getByRole("link", { name: /Previous lesson/ }),
    ).toHaveAttribute("href", "/learn/introduction-to-phishing");
  });

  it("updates page title, description, and canonical URL for a lesson", async () => {
    render(
      <MemoryRouter initialEntries={["/learn/email-phishing"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.title).toBe("Email phishing | PhisGuard");
      expect(
        document.querySelector('meta[name="description"]'),
      ).toHaveAttribute("content", expect.stringContaining("Email phishing"));
      expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${window.location.origin}/learn/email-phishing`,
      );
    });
  });

  it("provides a responsive navigation menu that can be opened and closed", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    const menuButton = screen.getByRole("button", { name: "Menu" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile primary navigation",
    });
    expect(within(mobileNavigation).getAllByRole("link")).toHaveLength(
      navItems.length,
    );

    fireEvent.click(
      within(mobileNavigation).getByRole("link", { name: "Learn" }),
    );
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Learn to spot the signal.",
      }),
    ).toBeInTheDocument();
  });

  it("shows a useful recovery path for unknown lesson slugs", () => {
    render(
      <MemoryRouter initialEntries={["/learn/not-a-lesson"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Lesson not found" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Browse all lessons" }),
    ).toHaveAttribute("href", "/learn");
  });

  it("lists every lesson from the curriculum on the learning centre", () => {
    render(
      <MemoryRouter initialEntries={["/learn"]}>
        <App />
      </MemoryRouter>,
    );

    for (const lesson of lessons) {
      const lessonLink = screen.getByRole("link", {
        name: (_name, element) =>
          element?.textContent?.includes(lesson.title) ?? false,
      });
      expect(lessonLink).toHaveAttribute("href", `/learn/${lesson.slug}`);
    }
  });

  it("filters lessons by topic and reports an empty search result", () => {
    render(
      <MemoryRouter initialEntries={["/learn"]}>
        <App />
      </MemoryRouter>,
    );

    const search = screen.getByRole("searchbox", { name: "Search lessons" });
    fireEvent.change(search, { target: { value: "smishing" } });
    expect(
      screen.getByRole("link", { name: /SMS phishing \(smishing\)/ }),
    ).toHaveAttribute("href", "/learn/sms-phishing-smishing");
    expect(
      screen.queryByRole("link", { name: /Email phishing/ }),
    ).not.toBeInTheDocument();

    fireEvent.change(search, { target: { value: "no matching topic" } });
    expect(screen.getByRole("status")).toHaveTextContent(
      "No lessons match “no matching topic”.",
    );
  });
});
