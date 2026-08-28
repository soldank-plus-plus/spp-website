// Hand-written helper (not touched by `openapi-codegen`). The backend
// doesn't document error responses in its OpenAPI schema, so the generated
// hooks' `error` is untyped at runtime. NestJS's default exception filter
// shape is `{ message, statusCode }`; the generated fetcher's declared
// fallback shape is `{ payload }`. Check for both defensively.
export function getErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === "object") {
        if ("message" in error && typeof error.message === "string") {
            return error.message;
        }
        if ("payload" in error && typeof error.payload === "string") {
            return error.payload;
        }
    }
    return fallback;
}
