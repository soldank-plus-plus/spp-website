import { vi, type Mock } from "vitest";

export interface FakeResponseInit {
    status?: number;
    body?: unknown;
    // Passed through verbatim so a suite can hand back a body the parser
    // chokes on, which a `body` object could never express
    rawBody?: string;
    contentType?: string | null;
}

export function fakeResponse({
    status = 200,
    body,
    rawBody,
    contentType = "application/json",
}: FakeResponseInit = {}): Response {
    const text = rawBody ?? JSON.stringify(body ?? null);
    const headers = new Headers();
    if (contentType !== null) headers.set("content-type", contentType);

    return {
        ok: status >= 200 && status < 300,
        status,
        headers,
        json: async () => JSON.parse(text),
        text: async () => text,
        blob: async () => new Blob([text]),
        arrayBuffer: async () => {
            // Built in this realm on purpose: a buffer from another realm
            // fails the instanceof check libraries like jszip run on it
            const bytes = new TextEncoder().encode(text);
            const buffer = new ArrayBuffer(bytes.byteLength);
            new Uint8Array(buffer).set(bytes);
            return buffer;
        },
    } as unknown as Response;
}

// Replaces window.fetch for the test. `restoreMocks` in the vitest config
// puts the original back afterwards
export function installFetch(
    handler: (url: string, init?: RequestInit) => Promise<Response> | Response
): Mock {
    const mock = vi.fn((input: RequestInfo | URL, init?: RequestInit) =>
        Promise.resolve(handler(String(input), init))
    );

    vi.stubGlobal("fetch", mock);
    window.fetch = mock as unknown as typeof window.fetch;

    return mock;
}

export function installJsonFetch(init: FakeResponseInit = {}): Mock {
    return installFetch(() => fakeResponse(init));
}

export function installFailingFetch(error: unknown): Mock {
    const mock = vi.fn(() => Promise.reject(error));

    vi.stubGlobal("fetch", mock);
    window.fetch = mock as unknown as typeof window.fetch;

    return mock;
}
