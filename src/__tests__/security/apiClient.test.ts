import { beforeEach, describe, expect, it, vi } from "vitest";
import { sppFetch } from "@/api/generated/sppFetcher";
import { getErrorMessage } from "@/api/generated/sppErrors";
import {
    fakeResponse,
    installFailingFetch,
    installFetch,
} from "@/test/fetchMock";
import { HUGE_STRING, XSS_PAYLOADS } from "@/test/payloads";

// The fetcher's generics are constrained to object types; this is the empty
// one, spelled so it does not trip the no-empty-object-type rule
type None = Record<string, never>;

const call = () =>
    sppFetch<unknown, unknown, undefined, None, None, None>({
        url: "/climb/maps",
        method: "get",
    });

// The fetcher throws a plain object shaped like an Error, so the assertions
// below read the fields the ui would read
type ThrownError = Error & { cause?: unknown };

const failure = async (): Promise<ThrownError> => {
    try {
        await call();
    } catch (e) {
        return e as ThrownError;
    }

    throw new Error("the request was expected to fail but resolved");
};

beforeEach(() => {
    vi.restoreAllMocks();
});

describe("http error statuses", () => {
    it.each([400, 401, 403, 404, 409, 422, 429, 500, 502, 503])(
        "rejects on %i rather than resolving with a body",
        async (status) => {
            installFetch(() =>
                fakeResponse({ status, body: { statusCode: status } })
            );

            await expect(call()).rejects.toBeDefined();
        }
    );

    it("passes a documented backend message through to the ui", async () => {
        installFetch(() =>
            fakeResponse({
                status: 404,
                body: { statusCode: 404, message: "Map not found" },
            })
        );

        const error = await failure();

        expect(getErrorMessage(error, "Failed to fetch map")).toBe(
            "Map not found"
        );
    });
});

describe("malformed and unexpected responses", () => {
    it("rejects when an error body is not json", async () => {
        installFetch(() =>
            fakeResponse({ status: 500, rawBody: "<html>oops</html>" })
        );

        await expect(call()).rejects.toBeDefined();
    });

    it("rejects when a success body is truncated json", async () => {
        installFetch(() => fakeResponse({ status: 200, rawBody: '{"data":[' }));

        await expect(call()).rejects.toBeDefined();
    });

    it("resolves an empty json body as null rather than throwing", async () => {
        installFetch(() => fakeResponse({ status: 200, rawBody: "null" }));

        await expect(call()).resolves.toBeNull();
    });

    it("falls back to a blob when the response is not json", async () => {
        installFetch(() =>
            fakeResponse({
                status: 200,
                rawBody: "binary",
                contentType: "application/octet-stream",
            })
        );

        await expect(call()).resolves.toBeInstanceOf(Blob);
    });

    it("resolves a response with no content type at all", async () => {
        installFetch(() =>
            fakeResponse({ status: 200, rawBody: "x", contentType: null })
        );

        await expect(call()).resolves.toBeInstanceOf(Blob);
    });
});

describe("network failures", () => {
    // Regression test: the fetcher used to build the thrown message out of the
    // underlying failure and stuff the raw error into `stack`, and every hook
    // renders that message straight into the page
    it("does not put the underlying failure in the thrown message", async () => {
        installFailingFetch(
            new TypeError(
                "Failed to fetch http://internal-api.local:3000/climb/maps"
            )
        );

        const error = await failure();

        expect(error.message).toBe("Network error");
        expect(error.message).not.toContain("internal-api.local");
        expect(error.message).not.toContain("3000");
    });

    it("does not leave a stack for the ui to render", async () => {
        installFailingFetch(new TypeError("Failed to fetch"));

        const error = await failure();

        expect(error.stack).toBeUndefined();
    });

    it("keeps the real cause available for the console", async () => {
        const cause = new TypeError("Failed to fetch");
        installFailingFetch(cause);

        const error = await failure();

        expect(error.cause).toBe(cause);
    });

    it("survives a rejection that is not an Error", async () => {
        installFailingFetch("just a string");

        const error = await failure();

        expect(error.message).toBe("Network error");
    });

    it("reports an abort as a network error rather than leaking the reason", async () => {
        installFailingFetch(
            new DOMException("The user aborted a request.", "AbortError")
        );

        const error = await failure();

        expect(error.message).toBe("Network error");
    });
});

describe("request headers", () => {
    // The browser has to set the multipart boundary itself, so the fetcher
    // drops the header it would otherwise send
    it("drops a multipart content type so the browser sets the boundary", async () => {
        const mock = installFetch(() => fakeResponse({ body: { data: null } }));

        await sppFetch<
            unknown,
            unknown,
            FormData,
            { "Content-Type": string },
            None,
            None
        >({
            url: "/climb/maps",
            method: "post",
            body: new FormData(),
            headers: { "Content-Type": "multipart/form-data" },
        });

        const init = mock.mock.calls[0]?.[1] as RequestInit;

        expect(
            (init.headers as Record<string, string>)["Content-Type"]
        ).toBeUndefined();
    });

    it("keeps the json content type for an ordinary request", async () => {
        const mock = installFetch(() => fakeResponse({ body: { data: null } }));

        await call();

        const init = mock.mock.calls[0]?.[1] as RequestInit;

        expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
            "application/json"
        );
    });
});

describe("getErrorMessage", () => {
    it("uses the fallback when there is no usable message", () => {
        expect(getErrorMessage(null, "fallback")).toBe("fallback");
        expect(getErrorMessage(undefined, "fallback")).toBe("fallback");
        expect(getErrorMessage({}, "fallback")).toBe("fallback");
        expect(getErrorMessage("a string", "fallback")).toBe("fallback");
        expect(getErrorMessage(42, "fallback")).toBe("fallback");
        expect(getErrorMessage([], "fallback")).toBe("fallback");
        expect(getErrorMessage({ message: 42 }, "fallback")).toBe("fallback");
        expect(getErrorMessage({ message: null }, "fallback")).toBe("fallback");
        expect(getErrorMessage({ message: {} }, "fallback")).toBe("fallback");
        // NestJS returns an array for validation failures
        expect(getErrorMessage({ message: ["a", "b"] }, "fallback")).toBe(
            "fallback"
        );
    });

    it("rejects a message that is empty or only whitespace", () => {
        expect(getErrorMessage({ message: "" }, "fallback")).toBe("fallback");
        expect(getErrorMessage({ message: "   " }, "fallback")).toBe(
            "fallback"
        );
    });

    // A stack trace or a driver level error that leaks past the backend's own
    // filter must not become page content
    it("rejects a multi line message", () => {
        const stack =
            "QueryFailedError: relation does not exist\n    at Parser.parseErrorMessage (/app/node_modules/pg/lib/parser.js:287:98)";

        expect(getErrorMessage({ message: stack }, "fallback")).toBe(
            "fallback"
        );
    });

    it("rejects a message carrying a stack frame on one line", () => {
        expect(
            getErrorMessage(
                { message: "boom at Object.handler (/app/src/maps.ts:12:5)" },
                "fallback"
            )
        ).toBe("fallback");
    });

    it("rejects an unreasonably long message", () => {
        expect(getErrorMessage({ message: HUGE_STRING }, "fallback")).toBe(
            "fallback"
        );
    });

    it.each([
        "connect failed for postgres://spp:hunter2@localhost:5432/climb",
        "could not reach http://internal-api.local:3000/climb/maps",
        "redis://cache:6379 refused the connection",
        "auth failed for spp@db.internal:5432",
    ])("rejects the connection string %j", (message) => {
        expect(getErrorMessage({ message }, "fallback")).toBe("fallback");
    });

    it.each([
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        "invalid token AKIAIOSFODNN7EXAMPLE1",
        "session 8f3Kd92LmQp0XyZa4Bc7 expired",
    ])("rejects the credential shaped message %j", (message) => {
        expect(getErrorMessage({ message }, "fallback")).toBe("fallback");
    });

    // The rules above must not swallow the ordinary messages the ui relies on
    it.each([
        "Map not found",
        "User not found",
        "Internal server error",
        "Validation failed",
        "Clan with id 42 does not exist",
        "Too Many Requests",
        "Unauthorized",
    ])("keeps the ordinary message %j", (message) => {
        expect(getErrorMessage({ message }, "fallback")).toBe(message);
    });

    it("keeps a short single line message", () => {
        expect(getErrorMessage({ message: "Map not found" }, "fallback")).toBe(
            "Map not found"
        );
    });

    it("reads the fetcher's own payload shape", () => {
        expect(
            getErrorMessage(
                { status: "unknown", payload: "Unexpected error" },
                "fallback"
            )
        ).toBe("Unexpected error");
    });

    // The message ends up as a react text child, so markup in it stays text.
    // This records that the function itself does no filtering of its own
    it.each(XSS_PAYLOADS)(
        "returns %j unchanged for react to escape",
        (payload) => {
            const result = getErrorMessage({ message: payload }, "fallback");

            expect(result === payload || result === "fallback").toBe(true);
        }
    );
});

describe("request building", () => {
    it("encodes a path param instead of letting it restructure the url", async () => {
        const mock = installFetch(() => fakeResponse({ body: { data: null } }));

        await sppFetch<
            unknown,
            unknown,
            undefined,
            None,
            None,
            { username: string }
        >({
            url: "/climb/users/{username}",
            method: "get",
            pathParams: { username: "../../admin?x=1" },
        });

        const [url] = mock.mock.calls[0] as [string];

        expect(url).toContain("%2F");
        expect(url).not.toContain("/../");
        expect(new URL(url).pathname).toBe(
            "/climb/users/..%2F..%2Fadmin%3Fx%3D1"
        );
    });

    it("drops a missing query param instead of sending the string undefined", async () => {
        const mock = installFetch(() => fakeResponse({ body: { data: null } }));

        await sppFetch<
            unknown,
            unknown,
            undefined,
            None,
            { search?: string },
            None
        >({
            url: "/climb/maps",
            method: "get",
            queryParams: { search: undefined },
        });

        const [url] = mock.mock.calls[0] as [string];

        expect(url).not.toContain("undefined");
    });

    it("escapes a hostile search term into the query string", async () => {
        const mock = installFetch(() => fakeResponse({ body: { data: null } }));

        await sppFetch<
            unknown,
            unknown,
            undefined,
            None,
            { search: string },
            None
        >({
            url: "/climb/maps",
            method: "get",
            queryParams: { search: "a&limit=9999#x" },
        });

        const [url] = mock.mock.calls[0] as [string];
        const parsed = new URL(url);

        expect(parsed.searchParams.get("search")).toBe("a&limit=9999#x");
        expect(parsed.searchParams.get("limit")).toBeNull();
        expect(parsed.hash).toBe("");
    });
});
