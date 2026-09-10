import { describe, expect, it } from "vitest";
import { isSafeUrl, safeUrl } from "@/utils/url";
import {
    DANGEROUS_URLS,
    ENCODED_XSS_PAYLOADS,
    HUGE_STRING,
    MALFORMED_VALUES,
    UNICODE_PAYLOADS,
    XSS_PAYLOADS,
} from "@/test/payloads";

describe("isSafeUrl", () => {
    it.each(DANGEROUS_URLS)("rejects %j", (value) => {
        expect(isSafeUrl(value)).toBe(false);
    });

    // The separators a browser drops before it parses the scheme, each one
    // spliced into the middle of "javascript"
    it.each([
        "\u0000",
        "\u0001",
        "\u0008",
        "\u0009",
        "\n",
        "\r",
        "\u000b",
        "\u000c",
        " ",
        "\u00a0",
        "\u2028",
        "\u2029",
        "\ufeff",
        "\u200b",
    ])("rejects javascript: split by %j", (separator) => {
        expect(isSafeUrl(`java${separator}script:alert(1)`)).toBe(false);
        expect(isSafeUrl(`${separator}javascript:alert(1)`)).toBe(false);
    });

    it.each([
        "JAVASCRIPT:alert(1)",
        "JaVaScRiPt:alert(1)",
        "jAvAsCrIpT:alert(1)",
        "DATA:text/html,x",
        "VBScript:msgbox(1)",
    ])("rejects %j whatever the casing", (value) => {
        expect(isSafeUrl(value)).toBe(false);
    });

    it.each([
        "/mapviewer/screenshots/climb_a.png",
        "assets/avatar.png",
        "./relative.png",
        "../sibling.png",
        "?just=a-query",
        "#just-a-fragment",
        "",
        "https://example.com/a.png",
        "http://example.com/a.png",
        "mailto:someone@example.com",
        "//example.com/a.png",
    ])("accepts the non executable url %j", (value) => {
        expect(isSafeUrl(value)).toBe(true);
    });

    // A colon later in the path is not a scheme, so an ordinary map name
    // containing one still works
    it.each([
        "/maps/a:b.png",
        "/mapviewer/data/climb/textures/12:34.bmp",
        "./a:b.png",
    ])("accepts %j, where the colon is not a scheme", (value) => {
        expect(isSafeUrl(value)).toBe(true);
    });

    // A browser reads a leading "a:" as a scheme rather than as a directory,
    // so a bare relative path whose first segment holds a colon is genuinely
    // ambiguous and is treated as unsafe
    it("rejects a bare relative path that starts with a colon segment", () => {
        expect(isSafeUrl("a:b/c.png")).toBe(false);
    });

    it.each([
        ...XSS_PAYLOADS,
        ...ENCODED_XSS_PAYLOADS,
        ...UNICODE_PAYLOADS,
        ...MALFORMED_VALUES,
    ])("never throws on %j", (value) => {
        expect(() => isSafeUrl(value)).not.toThrow();
    });

    it("never throws on a very long value", () => {
        expect(() => isSafeUrl(HUGE_STRING)).not.toThrow();
        expect(() => isSafeUrl(`javascript:${HUGE_STRING}`)).not.toThrow();
        expect(isSafeUrl(`javascript:${HUGE_STRING}`)).toBe(false);
    });
});

describe("safeUrl", () => {
    it.each(DANGEROUS_URLS)("replaces %j with the fallback", (value) => {
        expect(safeUrl(value)).toBe("");
        expect(safeUrl(value, "/placeholder.png")).toBe("/placeholder.png");
    });

    it("passes a safe url straight through", () => {
        expect(safeUrl("/a.png")).toBe("/a.png");
        expect(safeUrl("https://example.com/a.png")).toBe(
            "https://example.com/a.png"
        );
    });
});
