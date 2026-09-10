// Hand-written helper (not touched by `openapi-codegen`). The backend
// doesn't document error responses in its OpenAPI schema, so the generated
// hooks' `error` is untyped at runtime. NestJS's default exception filter
// shape is `{ message, statusCode }`; the generated fetcher's declared
// fallback shape is `{ payload }`. Check for both defensively.

// Every hook renders what comes back straight into the page, so a message is
// only passed through when it still looks like the short human sentence the
// exception filter is supposed to produce. Anything carrying the shape of a
// stack trace, a connection string or a credential becomes the caller's own
// fallback instead. This cannot recognise every secret, and a backend that
// puts one in an error message is still a backend bug: it is here so that
// such a bug does not also become page content.
const MAX_LENGTH = 200;

const STACK_FRAME = /\bat\s+\S+\s+\(/;

// "postgres://user:pass@host" and "user@host:5432" alike
const URL_LIKE = /[a-z][a-z0-9+.-]*:\/\/|@[\w.-]+:\d+/i;

// A long unbroken run mixing letters and digits is a token, a key or a hash
// rather than a word. A real word that long carries no digits, and an id the
// message wants to name is normally short and spaced off from its label
const looksLikeToken = (message: string): boolean =>
    (message.match(/[A-Za-z0-9_-]{16,}/g) ?? []).some(
        (run) => /[A-Za-z]/.test(run) && /[0-9]/.test(run)
    );

const isDisplayable = (message: string): boolean =>
    message.trim().length > 0 &&
    message.length <= MAX_LENGTH &&
    !/[\r\n]/.test(message) &&
    !STACK_FRAME.test(message) &&
    !URL_LIKE.test(message) &&
    !looksLikeToken(message);

export function getErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === "object") {
        if (
            "message" in error &&
            typeof error.message === "string" &&
            isDisplayable(error.message)
        ) {
            return error.message;
        }
        if (
            "payload" in error &&
            typeof error.payload === "string" &&
            isDisplayable(error.payload)
        ) {
            return error.payload;
        }
    }
    return fallback;
}
