import { expect } from "vitest";

declare global {
    interface Window {
        __xss?: unknown;
    }
}

// Every payload in the corpus writes window.__xss, so a suite can prove the
// flag stayed untouched. jsdom does not fetch images or run an <img onerror>
// on its own, so this is a supporting check rather than the real one: the
// structural assertions below are what actually prove nothing was parsed as
// markup
export function expectNoXssFlag(): void {
    expect(window.__xss).toBeUndefined();
}

export function resetXssFlag(): void {
    delete window.__xss;
}

const EXECUTABLE_TAGS = [
    "script",
    "iframe",
    "object",
    "embed",
    "link",
    "meta",
    "base",
    "form",
];

// Where a url is followed as a document: a bad scheme here actually runs or
// navigates, so every executable scheme counts
const NAVIGABLE_ATTRIBUTES: [string, string][] = [
    ["a", "href"],
    ["area", "href"],
    ["iframe", "src"],
    ["form", "action"],
    ["button", "formaction"],
    ["object", "data"],
    ["embed", "src"],
    ["base", "href"],
];

// Where a url only ever loads a subresource. A browser will not run
// javascript: in an <img src>, so the finding worth reporting there is the
// narrower one: input that was never filtered at all
const SUBRESOURCE_ATTRIBUTES: [string, string][] = [
    ["img", "src"],
    ["source", "src"],
    ["video", "src"],
    ["audio", "src"],
    ["track", "src"],
];

const NAVIGABLE_SCHEME = /^(javascript|vbscript|data|blob|file):/i;
const SCRIPTABLE_SCHEME = /^(javascript|vbscript):/i;

// A scheme check has to survive the characters a browser strips before it
// parses the scheme, otherwise "java\tscript:" walks straight past it
// eslint-disable-next-line no-control-regex
const IGNORED = /[\u0000-\u0020\u00a0\u1680\u2000-\u200d\u2028\u2029\ufeff]/g;

const stripControlCharacters = (value: string) => value.replace(IGNORED, "");

export function isDangerousUrl(value: string | null): boolean {
    if (!value) return false;
    return NAVIGABLE_SCHEME.test(stripControlCharacters(value));
}

export function isScriptableUrl(value: string | null): boolean {
    if (!value) return false;
    return SCRIPTABLE_SCHEME.test(stripControlCharacters(value));
}

export function inlineHandlerAttributes(root: ParentNode): string[] {
    const found: string[] = [];

    root.querySelectorAll("*").forEach((element) => {
        for (const attribute of Array.from(element.attributes)) {
            if (attribute.name.toLowerCase().startsWith("on")) {
                found.push(
                    `${element.tagName.toLowerCase()}[${attribute.name}]`
                );
            }
        }
    });

    return found;
}

export function dangerousUrlAttributes(root: ParentNode): string[] {
    const found: string[] = [];

    const check = (
        pairs: [string, string][],
        predicate: (value: string | null) => boolean
    ) => {
        for (const [tag, name] of pairs) {
            root.querySelectorAll(tag).forEach((element) => {
                const value = element.getAttribute(name);
                if (predicate(value)) found.push(`${tag}[${name}=${value}]`);
            });
        }
    };

    check(NAVIGABLE_ATTRIBUTES, isDangerousUrl);
    check(SUBRESOURCE_ATTRIBUTES, isScriptableUrl);

    return found;
}

// Subresource urls that leave the site, which the production CSP would block
// but which still mean an unfiltered value reached an attribute
export function offOriginResourceAttributes(
    root: ParentNode,
    origin = "https://spp.test"
): string[] {
    const found: string[] = [];

    for (const [tag, name] of SUBRESOURCE_ATTRIBUTES) {
        root.querySelectorAll(tag).forEach((element) => {
            const value = element.getAttribute(name);
            if (!value) return;
            try {
                if (new URL(value, origin).origin !== origin) {
                    found.push(`${tag}[${name}=${value}]`);
                }
            } catch {
                found.push(`${tag}[${name}=${value}] (unparseable)`);
            }
        });
    }

    return found;
}

// The assertion the xss suites lean on: whatever the payload was, the render
// must not have produced a way to run it
export function expectNoExecutableMarkup(root: ParentNode): void {
    for (const tag of EXECUTABLE_TAGS) {
        expect(
            Array.from(root.querySelectorAll(tag)),
            `payload produced a <${tag}> element`
        ).toEqual([]);
    }

    expect(
        inlineHandlerAttributes(root),
        "payload produced an inline event handler"
    ).toEqual([]);

    expect(
        dangerousUrlAttributes(root),
        "payload produced a url with an executable scheme"
    ).toEqual([]);

    expectNoXssFlag();
}

// Proves the payload survived as inert text rather than being parsed: the
// exact characters are in the text content, and no element carries them as
// markup
export function expectRenderedAsInertText(
    root: ParentNode & { textContent: string | null },
    payload: string
): void {
    expect(root.textContent ?? "").toContain(payload);
    expectNoExecutableMarkup(root);
}
