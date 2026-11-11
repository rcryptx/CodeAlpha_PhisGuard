import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, vi } from "vitest";

import { Assessments } from "./Assessments";
import { AssessmentSession } from "./AssessmentSession";
import { assessmentQuestions } from "./questions";
import { getAssessmentQuestions } from "./scoring";
import type { AssessmentMode } from "./types";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("assessment interaction", () => {
  const topicMode: AssessmentMode = {
    kind: "topic",
    id: "introduction-to-phishing",
    title: "Introduction to phishing",
    lessonSlug: "introduction-to-phishing",
  };

  it("allows navigation and answer changes without revealing the correct answer", () => {
    render(
      <MemoryRouter>
        <Assessments />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Start topic assessment: Introduction to phishing",
      }),
    );
    const questions = getAssessmentQuestions(assessmentQuestions, {
      kind: "topic",
      lessonSlug: "introduction-to-phishing",
    });
    const first = questions[0];
    const second = questions[1];
    const correctOption = first.options.find(
      (option) => option.id === first.correctOptionId,
    )!;
    const wrongOption = first.options.find(
      (option) => option.id !== first.correctOptionId,
    )!;

    expect(screen.queryByText(first.explanation)).not.toBeInTheDocument();
    expect(screen.queryByText("Correct answer")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: wrongOption.text }));
    fireEvent.click(screen.getByRole("button", { name: "Next question" }));
    expect(screen.getByText(second.prompt)).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Question 1, answered" }),
    );
    expect(screen.getByRole("radio", { name: wrongOption.text })).toBeChecked();
    fireEvent.click(screen.getByRole("radio", { name: correctOption.text }));
    expect(
      screen.getByRole("radio", { name: correctOption.text }),
    ).toBeChecked();
    expect(screen.queryByText(first.explanation)).not.toBeInTheDocument();
  });

  it("warns before submitting unanswered questions and reviews results only after confirmation", () => {
    render(
      <MemoryRouter>
        <Assessments />
      </MemoryRouter>,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Start topic assessment: Introduction to phishing",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Next question" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit assessment" }));

    expect(screen.getByRole("alertdialog")).toHaveTextContent(
      "2 questions are unanswered",
    );
    expect(
      screen.queryByRole("heading", { name: /Final score/ }),
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Return to questions" }),
    );
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Submit assessment" }));
    const complete = screen.getByRole("button", {
      name: "Submit with unanswered questions",
    });
    fireEvent.click(complete);
    fireEvent.click(complete);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Introduction to phishing",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(screen.getByText("Unanswered")).toBeInTheDocument();
  });

  it("opens detailed answer review and a retry starts a fresh attempt without mutating prior results", () => {
    render(
      <MemoryRouter>
        <Assessments />
      </MemoryRouter>,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Start topic assessment: Introduction to phishing",
      }),
    );

    for (let index = 0; index < 2; index += 1) {
      const question = assessmentQuestions[index];
      const answer = question.options.find(
        (option) => option.id === question.correctOptionId,
      )!;
      fireEvent.click(screen.getByRole("radio", { name: answer.text }));
      if (index === 0) {
        fireEvent.click(screen.getByRole("button", { name: "Next question" }));
      }
    }
    fireEvent.click(screen.getByRole("button", { name: "Submit assessment" }));

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText(/Attempt 1/)).toBeInTheDocument();
    const reviewButton = screen.getByRole("button", {
      name: "Expand answer review",
    });
    fireEvent.click(reviewButton);
    expect(
      screen.getByText(assessmentQuestions[0].explanation),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry assessment" }));
    expect(screen.getByText(/Attempt 2/)).toBeInTheDocument();
    expect(
      screen.queryByText(assessmentQuestions[0].explanation),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("radio", {
        name: assessmentQuestions[0].options.find(
          (option) => option.id === assessmentQuestions[0].correctOptionId,
        )!.text,
      }),
    ).not.toBeChecked();

    for (let index = 0; index < 2; index += 1) {
      const question = assessmentQuestions[index];
      const answer = question.options.find(
        (option) => option.id === question.correctOptionId,
      )!;
      fireEvent.click(screen.getByRole("radio", { name: answer.text }));
      if (index === 0) {
        fireEvent.click(screen.getByRole("button", { name: "Next question" }));
      }
    }
    fireEvent.click(screen.getByRole("button", { name: "Submit assessment" }));
    expect(
      screen.getByText(/1 earlier attempt remains unchanged for this visit/),
    ).toBeInTheDocument();
  });

  it("prevents duplicate completion callbacks after final submission", () => {
    const questions = getAssessmentQuestions(assessmentQuestions, {
      kind: "topic",
      lessonSlug: topicMode.lessonSlug,
    });
    const onComplete = vi.fn();
    render(
      <MemoryRouter>
        <AssessmentSession
          mode={topicMode}
          questions={questions}
          attemptNumber={1}
          onComplete={onComplete}
          onCancel={vi.fn()}
        />
      </MemoryRouter>,
    );

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index];
      const answer = question.options.find(
        (option) => option.id === question.correctOptionId,
      )!;
      fireEvent.click(screen.getByRole("radio", { name: answer.text }));
      if (index < questions.length - 1) {
        fireEvent.click(screen.getByRole("button", { name: "Next question" }));
      }
    }

    fireEvent.click(screen.getByRole("button", { name: "Submit assessment" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit assessment" }));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toMatchObject({
      attemptNumber: 1,
      correctAnswers: questions.length,
      unansweredQuestions: 0,
    });
  });

  it("keeps answers local and does not add external links or network actions", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const openSpy = vi.spyOn(window, "open");
    render(
      <MemoryRouter>
        <Assessments />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Start full assessment" }),
    );
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
    expect(document.querySelector('a[href^="http"]')).toBeNull();
  });
});
