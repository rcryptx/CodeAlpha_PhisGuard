import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, vi } from "vitest";

import { InspectorForm } from "./InspectorForm";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("InspectorForm", () => {
  it("analyzes a URL locally and displays grouped explainable findings", () => {
    render(
      <MemoryRouter>
        <InspectorForm />
      </MemoryRouter>,
    );
    expect(
      screen.getByText(
        "No obvious indicators detected does not guarantee that a URL is safe. This analysis does not visit the website or check its live reputation.",
      ),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "URL to analyze" }), {
      target: { value: "http://example.com:8080/" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze URL" }));

    expect(
      screen.getByRole("heading", { name: "Suspicious" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Connection is not encrypted by HTTPS"),
    ).toBeInTheDocument();
    expect(screen.getByText("URL uses a non-default port")).toBeInTheDocument();
    expect(screen.getAllByText("Recommendation").length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        "No obvious indicators detected does not guarantee that a URL is safe. This analysis does not visit the website or check its live reputation.",
      ),
    ).toBeInTheDocument();
  });

  it("shows invalid input errors and supports clearing input and findings", () => {
    render(
      <MemoryRouter>
        <InspectorForm />
      </MemoryRouter>,
    );

    const input = screen.getByRole("textbox", { name: "URL to analyze" });
    fireEvent.change(input, { target: { value: "example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Analyze URL" }));

    expect(
      screen.getByRole("heading", { name: "Invalid URL" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("including its scheme");

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(input).toHaveValue("");
    expect(screen.getByText("Ready to analyze")).toBeInTheDocument();
  });

  it("does not fetch, open, or embed the submitted URL", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const openSpy = vi.spyOn(window, "open");
    const submittedUrl = "https://example.invalid/account";

    render(
      <MemoryRouter>
        <InspectorForm />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "URL to analyze" }), {
      target: { value: submittedUrl },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze URL" }));

    expect(
      screen.getByText("No obvious structural indicators detected"),
    ).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
    expect(document.querySelector("iframe")).toBeNull();
    expect(
      screen.getByText("https://example.invalid/[path omitted]"),
    ).toBeInTheDocument();
  });

  it("renders a URL anatomy breakdown and masks query values", () => {
    render(
      <MemoryRouter>
        <InspectorForm />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "URL to analyze" }), {
      target: {
        value: "https://login.accounts.example.com/settings?tab=security#top",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze URL" }));

    expect(
      screen.getByRole("heading", { name: "URL anatomy" }),
    ).toBeInTheDocument();
    expect(screen.getByText("login.accounts")).toBeInTheDocument();
    expect(screen.getByText("example.com")).toBeInTheDocument();
    expect(screen.getByText("?tab=•••")).toBeInTheDocument();
    expect(screen.getByText("#(present)")).toBeInTheDocument();
    expect(screen.queryByText("security")).toBeNull();
  });

  it("copies a report that omits sensitive values", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(
      <MemoryRouter>
        <InspectorForm />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "URL to analyze" }), {
      target: { value: "https://example.com/reset?access_token=topsecret" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze URL" }));
    fireEvent.click(screen.getByRole("button", { name: "Copy report" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    const copied = writeText.mock.calls[0][0] as string;
    expect(copied).toContain("PhisGuard - URL analysis report");
    expect(copied).toContain("access_token");
    expect(copied).not.toContain("topsecret");
  });

  it("explains the limitation of each finding", () => {
    render(
      <MemoryRouter>
        <InspectorForm />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "URL to analyze" }), {
      target: { value: "http://example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyze URL" }));

    expect(screen.getByText("Limitation")).toBeInTheDocument();
  });
});
