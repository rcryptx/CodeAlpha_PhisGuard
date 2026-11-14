import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach } from "vitest";

import App from "@/App";
import { lessons } from "@/features/learning/curriculum";

import { PROGRESS_STORAGE_KEY } from "./progressData";
import { markLessonCompleted } from "./progressStore";

function resetProgressStorage() {
  window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: PROGRESS_STORAGE_KEY,
      newValue: null,
      storageArea: window.localStorage,
    }),
  );
}

beforeEach(() => {
  resetProgressStorage();
});

describe("lesson progress experience", () => {
  it("shows an empty dashboard and does not count merely opening a lesson", async () => {
    render(
      <MemoryRouter initialEntries={["/progress"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "A fresh place to begin" }),
    ).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(
      screen.getByText(`${lessons.length} lessons are not marked complete.`),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("link", { name: "Browse the learning centre" }),
    );
    fireEvent.click(
      await screen.findByRole("link", {
        name: (_name, element) =>
          element?.textContent?.includes(lessons[0].title) ?? false,
      }),
    );
    expect(
      await screen.findByRole("button", { name: "Mark lesson complete" }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toBeNull();
  });

  it("marks a lesson complete once, reflects it in the curriculum, and supports reopening", async () => {
    render(
      <MemoryRouter initialEntries={[`/learn/${lessons[0].slug}`]}>
        <App />
      </MemoryRouter>,
    );

    fireEvent.click(
      await screen.findByRole("button", { name: "Mark lesson complete" }),
    );
    const saved = JSON.parse(
      window.localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "null",
    ) as { version: number; completedLessons: Array<{ lessonSlug: string }> };
    expect(saved.version).toBe(1);
    expect(saved.completedLessons).toHaveLength(1);
    expect(saved.completedLessons[0].lessonSlug).toBe(lessons[0].slug);
    markLessonCompleted(lessons[0].slug);
    const savedAfterDuplicate = JSON.parse(
      window.localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "null",
    ) as { completedLessons: Array<{ lessonSlug: string }> };
    expect(savedAfterDuplicate.completedLessons).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "Mark as incomplete" }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("link", { name: /Next lesson.*Email phishing/ }),
    );
    expect(
      await screen.findByRole("button", { name: "Mark lesson complete" }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("link", {
        name: /Previous lesson.*Introduction to phishing/,
      }),
    );
    expect(
      await screen.findByRole("button", { name: "Mark as incomplete" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mark as incomplete" }));
    expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toContain(
      '"completedLessons":[]',
    );
    expect(
      screen.getByRole("button", { name: "Mark lesson complete" }),
    ).toBeInTheDocument();
  });

  it("reloads completion state from local storage", async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={[`/learn/${lessons[0].slug}`]}>
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(
      await screen.findByRole("button", { name: "Mark lesson complete" }),
    );

    const persistedValue = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    expect(persistedValue).not.toBeNull();
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: PROGRESS_STORAGE_KEY,
          newValue: persistedValue,
          storageArea: window.localStorage,
        }),
      );
    });
    expect(
      screen.getByRole("button", { name: "Mark as incomplete" }),
    ).toBeInTheDocument();

    unmount();
    render(
      <MemoryRouter initialEntries={[`/learn/${lessons[0].slug}`]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("button", { name: "Mark as incomplete" }),
    ).toBeInTheDocument();
  });

  it("shows a completed lesson in the Learning Centre", async () => {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        completedLessons: [
          {
            lessonSlug: lessons[0].slug,
            completedAt: new Date().toISOString(),
          },
        ],
      }),
    );
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: PROGRESS_STORAGE_KEY,
        newValue: window.localStorage.getItem(PROGRESS_STORAGE_KEY),
        storageArea: window.localStorage,
      }),
    );

    render(
      <MemoryRouter initialEntries={["/learn"]}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByText("Completed")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: (_name, element) =>
          element?.textContent?.includes(lessons[0].title) ?? false,
      }),
    ).toHaveAttribute("href", `/learn/${lessons[0].slug}`);
  });

  it("renders dashboard counts, recent activity, and links to completed lessons", async () => {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        completedLessons: [
          {
            lessonSlug: lessons[0].slug,
            completedAt: new Date().toISOString(),
          },
        ],
      }),
    );
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: PROGRESS_STORAGE_KEY,
        newValue: window.localStorage.getItem(PROGRESS_STORAGE_KEY),
        storageArea: window.localStorage,
      }),
    );

    render(
      <MemoryRouter initialEntries={["/progress"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText("8%")).toBeInTheDocument();
    expect(screen.getByText(/1\s+lesson completed/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Recently completed" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: lessons[0].title }),
    ).toHaveAttribute("href", `/learn/${lessons[0].slug}`);
    expect(
      screen.getByText(
        `${lessons.length - 1} lessons are not marked complete.`,
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: lessons[0].title }));
    expect(
      await screen.findByRole("button", { name: "Mark as incomplete" }),
    ).toBeInTheDocument();
  });

  it("shows a clear notice when saved data contains unknown or invalid lesson records", async () => {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        completedLessons: [
          {
            lessonSlug: "removed-lesson",
            completedAt: new Date().toISOString(),
          },
        ],
      }),
    );
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: PROGRESS_STORAGE_KEY,
        newValue: window.localStorage.getItem(PROGRESS_STORAGE_KEY),
        storageArea: window.localStorage,
      }),
    );

    render(
      <MemoryRouter initialEntries={["/progress"]}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      "1 invalid or outdated saved progress record was ignored.",
    );
    expect(
      screen.getByRole("heading", { name: "A fresh place to begin" }),
    ).toBeInTheDocument();
  });

  it("allows clearing all saved progress locally", async () => {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        completedLessons: [
          {
            lessonSlug: "introduction-to-phishing",
            completedAt: new Date().toISOString(),
          },
        ],
      }),
    );
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: PROGRESS_STORAGE_KEY,
        newValue: window.localStorage.getItem(PROGRESS_STORAGE_KEY),
        storageArea: window.localStorage,
      }),
    );

    render(
      <MemoryRouter initialEntries={["/progress"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText("8%")).toBeInTheDocument();
    expect(screen.getByText(/1\s+lesson completed/)).toBeInTheDocument();
    const resetButton = screen.getByRole("button", {
      name: "Reset local progress",
    });
    expect(resetButton).toBeInTheDocument();
    fireEvent.click(resetButton);

    expect(
      screen.getByRole("heading", { name: "A fresh place to begin" }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toContain(
      '"completedLessons":[]',
    );
  });
});
