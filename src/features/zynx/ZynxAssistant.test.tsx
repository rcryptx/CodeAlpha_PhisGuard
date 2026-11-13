import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "@/App";

const MEMORY_KEY = "phisguard.zynx.profile";

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function renderApp(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

afterEach(() => {
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

describe("application-wide ZYNX assistant", () => {
  it("introduces itself, asks for a name, and keeps it session-only by default", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ configured: false }));
    vi.stubGlobal("fetch", fetchMock);
    renderApp();

    const launcher = screen.getByRole("button", {
      name: "Open ZYNX assistant",
    });
    expect(launcher).toHaveAttribute("title", "Open ZYNX assistant");
    fireEvent.click(launcher);
    expect(screen.queryByText("Ask ZYNX")).not.toBeInTheDocument();
    expect(await screen.findByText(/Hi, I’m ZYNX/)).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Your name or nickname" }),
    ).toBeInTheDocument();
    const remember = screen.getByRole("checkbox", {
      name: /Remember this name on this device/,
    });
    expect(remember).not.toBeChecked();

    fireEvent.change(
      screen.getByRole("textbox", { name: "Your name or nickname" }),
      {
        target: { value: "Asha" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByText(/Hi, Asha/)).toBeInTheDocument();
    expect(window.localStorage.getItem(MEMORY_KEY)).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText(/Gemini is not configured/),
    ).toBeInTheDocument();
  });

  it("saves only the preferred name after consent and lets the user forget it", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ configured: false })),
    );
    const view = renderApp();
    fireEvent.click(
      screen.getByRole("button", { name: "Open ZYNX assistant" }),
    );
    await screen.findByText(/Hi, I’m ZYNX/);
    fireEvent.change(
      screen.getByRole("textbox", { name: "Your name or nickname" }),
      {
        target: { value: "Mira" },
      },
    );
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /Remember this name on this device/,
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    const saved = JSON.parse(
      window.localStorage.getItem(MEMORY_KEY) ?? "null",
    ) as { displayName: string; consentToMemory: boolean };
    expect(saved).toEqual({ displayName: "Mira", consentToMemory: true });

    fireEvent.click(screen.getByRole("button", { name: "Forget name" }));
    expect(window.localStorage.getItem(MEMORY_KEY)).toBeNull();
    expect(
      screen.getByRole("textbox", { name: "Your name or nickname" }),
    ).toBeInTheDocument();
    view.unmount();
  });

  it("sends current route context and renders Gemini replies as plain text", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ configured: true }))
      .mockResolvedValueOnce(
        jsonResponse({
          reply: "Use a trusted route. <img src=x onerror=alert(1)>",
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    renderApp("/inspector");

    fireEvent.click(
      screen.getByRole("button", { name: "Open ZYNX assistant" }),
    );
    await screen.findByRole("textbox", { name: "Your name or nickname" });
    fireEvent.change(
      screen.getByRole("textbox", { name: "Your name or nickname" }),
      {
        target: { value: "Ravi" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await screen.findByRole("textbox", { name: "Message ZYNX" });

    fireEvent.change(screen.getByRole("textbox", { name: "Message ZYNX" }), {
      target: { value: "What does this page do?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(
      await screen.findByText(
        "Use a trusted route. <img src=x onerror=alert(1)>",
      ),
    ).toBeInTheDocument();
    expect(document.querySelector("#zynx-assistant-panel img")).toBeNull();
    const requestBody = JSON.parse(
      fetchMock.mock.calls[1][1].body as string,
    ) as {
      displayName: string;
      pageContext: string;
      messages: Array<{ role: string; content: string }>;
    };
    expect(requestBody).toMatchObject({
      displayName: "Ravi",
      pageContext: "URL Inspector",
      messages: [{ role: "user", content: "What does this page do?" }],
    });
    expect(window.localStorage.getItem(MEMORY_KEY)).toBeNull();
  });

  it("shows configuration errors, supports retry, and keeps application routes usable", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ configured: true }))
      .mockResolvedValueOnce(
        jsonResponse(
          {
            error: {
              code: "gemini_quota_or_rate_limit",
              message: "Wait and retry.",
            },
          },
          429,
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse({ reply: "Try a separate trusted channel." }),
      );
    vi.stubGlobal("fetch", fetchMock);
    renderApp("/zynx");

    fireEvent.click(
      screen.getByRole("button", { name: "Open ZYNX assistant" }),
    );
    await screen.findByRole("textbox", { name: "Your name or nickname" });
    fireEvent.change(
      screen.getByRole("textbox", { name: "Your name or nickname" }),
      {
        target: { value: "Dev" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await screen.findByRole("textbox", { name: "Message ZYNX" });
    fireEvent.change(screen.getByRole("textbox", { name: "Message ZYNX" }), {
      target: { value: "How do I verify a message?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Wait and retry.",
    );

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(
      await screen.findByText("Try a separate trusted channel."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Your privacy and ZYNX’s limits" }),
    ).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
  });

  it("sends the visible conversation history on follow-up messages", async () => {
    window.localStorage.setItem(
      MEMORY_KEY,
      JSON.stringify({ displayName: "Ari", consentToMemory: true }),
    );
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ configured: true }))
      .mockResolvedValueOnce(jsonResponse({ reply: "A deceptive message." }))
      .mockResolvedValueOnce(
        jsonResponse({ reply: "Check the sender and verify independently." }),
      );
    vi.stubGlobal("fetch", fetchMock);
    renderApp();

    fireEvent.click(
      screen.getByRole("button", { name: "Open ZYNX assistant" }),
    );
    const messageBox = await screen.findByRole("textbox", {
      name: "Message ZYNX",
    });
    fireEvent.change(messageBox, {
      target: { value: "What is phishing?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await screen.findByText("A deceptive message.");

    fireEvent.change(messageBox, {
      target: { value: "How do I recognize it?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await screen.findByText("Check the sender and verify independently.");

    const followUpRequest = JSON.parse(
      fetchMock.mock.calls[2][1].body as string,
    ) as { messages: Array<{ role: string; content: string }> };
    expect(followUpRequest.messages).toEqual([
      { role: "user", content: "What is phishing?" },
      { role: "model", content: "A deceptive message." },
      { role: "user", content: "How do I recognize it?" },
    ]);
    expect(
      document.querySelectorAll("#zynx-assistant-panel time"),
    ).toHaveLength(4);
  });

  it("clears session chat without persisting conversation history", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ configured: true }))
      .mockResolvedValueOnce(jsonResponse({ reply: "A plain-text response." }));
    vi.stubGlobal("fetch", fetchMock);
    renderApp();

    fireEvent.click(
      screen.getByRole("button", { name: "Open ZYNX assistant" }),
    );
    await screen.findByRole("textbox", { name: "Your name or nickname" });
    fireEvent.change(
      screen.getByRole("textbox", { name: "Your name or nickname" }),
      {
        target: { value: "Lee" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await screen.findByRole("textbox", { name: "Message ZYNX" });
    fireEvent.change(screen.getByRole("textbox", { name: "Message ZYNX" }), {
      target: { value: "Explain MFA." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await screen.findByText("A plain-text response.");

    fireEvent.click(screen.getByRole("button", { name: "Clear chat" }));
    expect(
      screen.queryByText("A plain-text response."),
    ).not.toBeInTheDocument();
    expect(window.localStorage.getItem(MEMORY_KEY)).toBeNull();
  });
});
