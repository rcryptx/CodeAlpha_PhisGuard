import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { PracticeLab } from "./PracticeLab";
import { practiceScenarios } from "./scenarios";

describe("PracticeLab", () => {
  it("shows all scenarios as simulated and keeps scenario destinations non-clickable", () => {
    render(
      <MemoryRouter>
        <PracticeLab />
      </MemoryRouter>,
    );

    for (const scenario of practiceScenarios) {
      expect(
        screen.getByRole("button", {
          name: new RegExp(`Start scenario: ${scenario.title}`),
        }),
      ).toBeInTheDocument();
    }
    expect(document.querySelector('a[href^="http"]')).toBeNull();
    expect(screen.getByText(/No messages are sent/)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: new RegExp(`Start scenario: ${practiceScenarios[0].title}`),
      }),
    );
    expect(
      screen.getByText(/Simulated message · not sent to or from a real person/),
    ).toBeInTheDocument();
    expect(document.querySelector('a[href^="http"]')).toBeNull();
  });

  it("reveals feedback only after a decision and prevents duplicate submission", () => {
    render(
      <MemoryRouter>
        <PracticeLab />
      </MemoryRouter>,
    );

    const scenario = practiceScenarios[0];
    fireEvent.click(
      screen.getByRole("button", {
        name: new RegExp(`Start scenario: ${scenario.title}`),
      }),
    );
    expect(
      screen.queryByRole("heading", { name: "That was a safer choice" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "What would you do?" }),
    ).toBeInTheDocument();

    const wrongDecision = scenario.decisions.find(
      (decision) => decision.id !== scenario.correctDecisionId,
    );
    expect(wrongDecision).toBeDefined();
    fireEvent.click(screen.getByRole("radio", { name: wrongDecision!.label }));
    fireEvent.click(screen.getByRole("button", { name: "Submit decision" }));

    expect(
      screen.getByRole("heading", { name: "Take another look" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(scenario.explanation, { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText(scenario.recommendedResponse)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Submit decision" }),
    ).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent(
      "1 decision submitted in this session.",
    );

    fireEvent.click(screen.getByRole("button", { name: /All scenarios/ }));
    expect(
      screen.queryByRole("button", { name: "View session summary" }),
    ).not.toBeInTheDocument();
  });

  it("records every decision, shows an accurate summary, and resets the session", () => {
    render(
      <MemoryRouter>
        <PracticeLab />
      </MemoryRouter>,
    );

    for (const [index, scenario] of practiceScenarios.entries()) {
      fireEvent.click(
        screen.getByRole("button", {
          name: new RegExp(`Start scenario: ${scenario.title}`),
        }),
      );

      const decision = scenario.decisions.find(
        (item) => item.id === scenario.correctDecisionId,
      );
      expect(decision).toBeDefined();
      fireEvent.click(screen.getByRole("radio", { name: decision!.label }));
      fireEvent.click(screen.getByRole("button", { name: "Submit decision" }));

      expect(
        screen.getByRole("heading", { name: "That was a safer choice" }),
      ).toBeInTheDocument();

      if (index < practiceScenarios.length - 1) {
        fireEvent.click(screen.getByRole("button", { name: /All scenarios/ }));
      }
    }

    fireEvent.click(
      screen.getByRole("button", { name: "View session summary" }),
    );
    const summary = screen.getByRole("region", {
      name: "Practice session summary",
    });
    expect(
      within(summary).getByText("Scenarios attempted").parentElement,
    ).toHaveTextContent("8");
    expect(within(summary).getByText("100%")).toBeInTheDocument();
    expect(
      within(summary).getByText(/8 correct of 8 decisions/),
    ).toBeInTheDocument();

    fireEvent.click(
      within(summary).getByRole("button", { name: "Restart session" }),
    );
    expect(screen.getByText(/0 of 8 scenarios tried/)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Practice session summary" }),
    ).not.toBeInTheDocument();
  }, 15000);
});
