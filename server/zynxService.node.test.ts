import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import {
  createZynxServer,
  generateGeminiReply,
  validateChatRequest,
  type ZynxChatRequest,
  type ZynxServerOptions,
} from "./zynxService.ts";

const validRequest: ZynxChatRequest = {
  messages: [{ role: "user", content: "Explain phishing simply." }],
  displayName: "Sam",
  pageContext: "Learning Centre",
};

const liveServers: ReturnType<typeof createZynxServer>[] = [];

async function withServer<T>(
  options: ZynxServerOptions,
  action: (baseUrl: string) => Promise<T>,
) {
  const server = createZynxServer(options);
  liveServers.push(server);
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  try {
    return await action(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

afterEach(async () => {
  await Promise.all(
    liveServers.splice(0).map(
      (server) =>
        new Promise<void>((resolve) => {
          if (!server.listening) return resolve();
          server.close(() => resolve());
        }),
    ),
  );
});

test("validates and normalizes chat history while rejecting invalid requests", () => {
  const valid = validateChatRequest({
    messages: [
      { role: "user", content: "  Hello\u0000 world  " },
      { role: "model", content: "Hi." },
      { role: "user", content: "Follow up" },
    ],
    displayName: " Sam ",
    pageContext: "Learning Centre",
  });
  assert.equal(valid.valid, true);
  if (!valid.valid) return;
  assert.equal(valid.value.messages[0].content, "Hello world");
  assert.equal(valid.value.displayName, "Sam");

  assert.equal(validateChatRequest({ messages: [] }).valid, false);
  assert.equal(
    validateChatRequest({
      messages: [
        { role: "user", content: "First" },
        { role: "user", content: "Repeated role" },
      ],
    }).valid,
    false,
  );
  assert.equal(
    validateChatRequest({
      messages: [{ role: "model", content: "Not a user turn" }],
    }).valid,
    false,
  );
  assert.equal(
    validateChatRequest({
      messages: [{ role: "user", content: "x".repeat(2001) }],
    }).valid,
    false,
  );
});

test("sends a bounded Gemini request using a server-only authorization header", async () => {
  let observedUrl = "";
  let observedInit: RequestInit | undefined;
  const reply = await generateGeminiReply(validRequest, {
    apiKey: "test-only-api-key",
    model: "gemini-3.6-flash",
    fetcher: async (input, init) => {
      observedUrl = String(input);
      observedInit = init;
      return new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [{ text: "Phishing is a deceptive message." }],
              },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    },
  });

  assert.equal(reply, "Phishing is a deceptive message.");
  assert.equal(
    observedUrl,
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
  );
  assert.equal(new URL(observedUrl).search, "");
  assert.equal(
    new Headers(observedInit?.headers).get("x-goog-api-key"),
    "test-only-api-key",
  );
  const body: unknown = JSON.parse(String(observedInit?.body));
  assert.equal(typeof body, "object");
  assert.equal(observedInit?.signal instanceof AbortSignal, true);
});

test("reports missing configuration without contacting Gemini", async () => {
  let called = false;
  await assert.rejects(
    generateGeminiReply(validRequest, {
      apiKey: "",
      fetcher: async () => {
        called = true;
        return new Response();
      },
    }),
    (error: unknown) =>
      error instanceof Error &&
      "code" in error &&
      error.code === "gemini_not_configured",
  );
  assert.equal(called, false);
});

test("maps invalid-key, quota, provider, malformed, empty, network, and timeout errors", async () => {
  for (const [status, code, message] of [
    [401, "gemini_invalid_key", "key"],
    [429, "gemini_quota_or_rate_limit", "quota"],
    [503, "gemini_unavailable", "provider"],
  ] as const) {
    await assert.rejects(
      generateGeminiReply(validRequest, {
        apiKey: "test-key",
        fetcher: async () => new Response("", { status }),
      }),
      (error: unknown) =>
        error instanceof Error &&
        "code" in error &&
        error.code === code &&
        error.message.toLowerCase().includes(message),
    );
  }

  await assert.rejects(
    generateGeminiReply(validRequest, {
      apiKey: "test-key",
      fetcher: async () => new Response("{", { status: 200 }),
    }),
    /unreadable response/,
  );
  await assert.rejects(
    generateGeminiReply(validRequest, {
      apiKey: "test-key",
      fetcher: async () =>
        new Response(JSON.stringify({ candidates: [] }), { status: 200 }),
    }),
    /did not return a response/,
  );
  await assert.rejects(
    generateGeminiReply(validRequest, {
      apiKey: "test-key",
      fetcher: async () => {
        throw new Error("offline");
      },
    }),
    /Could not reach Gemini/,
  );
  await assert.rejects(
    generateGeminiReply(validRequest, {
      apiKey: "test-key",
      timeoutMs: 1,
      fetcher: (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        }),
    }),
    /took too long/,
  );
});

test("status endpoint reports missing key without exposing configuration", async () => {
  await withServer({ apiKey: "" }, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/zynx/status`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { configured: false });
  });
});

test("chat endpoint validates input and returns configuration-required errors", async () => {
  await withServer({ apiKey: "" }, async (baseUrl) => {
    const invalid = await fetch(`${baseUrl}/api/zynx/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [] }),
    });
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).error.code, "invalid_request");

    const missingKey = await fetch(`${baseUrl}/api/zynx/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validRequest),
    });
    assert.equal(missingKey.status, 503);
    assert.equal((await missingKey.json()).error.code, "gemini_not_configured");
  });
});

test("chat endpoint enforces body limits and per-client rate limits", async () => {
  await withServer(
    {
      apiKey: "test-key",
      rateLimit: 3,
      fetcher: async () => new Response("", { status: 503 }),
    },
    async (baseUrl) => {
      const tooLarge = await fetch(`${baseUrl}/api/zynx/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "a" }],
        }).padEnd(33_000, " "),
      });
      assert.equal(tooLarge.status, 413);

      for (let requestNumber = 0; requestNumber < 2; requestNumber += 1) {
        const response = await fetch(`${baseUrl}/api/zynx/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validRequest),
        });
        assert.equal(response.status, 502);
      }
      const limited = await fetch(`${baseUrl}/api/zynx/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validRequest),
      });
      assert.equal(limited.status, 429);
      assert.equal((await limited.json()).error.code, "rate_limited");
      assert.ok(limited.headers.get("retry-after"));
    },
  );
});
