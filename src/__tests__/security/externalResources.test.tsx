import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { Frame } from "@/components/layouts/Landing/Frame";
import { renderWithProviders } from "@/test/render";
import { buildContentSecurityPolicy } from "@/config/contentSecurityPolicy";

const SRC = join(process.cwd(), "src");

// The suites below scan the application's own source. The test support
// directories are skipped: the payload corpus is full of the very markup
// these assertions look for
const SKIPPED = new Set(["test", "__tests__"]);

const sourceFiles = (dir: string): string[] =>
    readdirSync(dir).flatMap((entry) => {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            return SKIPPED.has(entry) ? [] : sourceFiles(full);
        }
        return /\.(ts|tsx)$/.test(entry) && !/\.test\.tsx?$/.test(entry)
            ? [full]
            : [];
    });

const ALL_SOURCES = sourceFiles(SRC).map((path) => ({
    path,
    text: readFileSync(path, "utf8"),
}));

describe("the youtube embed", () => {
    it("loads nothing until a visitor asks for it", () => {
        const { container } = renderWithProviders(<Frame />);

        expect(container.querySelector("iframe")).toBeNull();
    });

    it("uses the no cookie host and a fixed video id once clicked", async () => {
        const user = userEvent.setup();
        const { container } = renderWithProviders(<Frame />);

        await user.click(screen.getByRole("button"));

        const src = container.querySelector("iframe")?.getAttribute("src");

        expect(src).toBe(
            "https://www.youtube-nocookie.com/embed/nD0waXaUw5Y?autoplay=1"
        );
        expect(new URL(src!).origin).toBe("https://www.youtube-nocookie.com");
    });

    it("is the only iframe the app renders", () => {
        const withIframes = ALL_SOURCES.filter(({ text }) =>
            text.includes("<iframe")
        );

        expect(withIframes.map(({ path }) => path.replace(SRC, "src"))).toEqual(
            ["src/components/layouts/Landing/Frame.tsx"]
        );
    });
});

describe("links that open a new tab", () => {
    // Without noopener the opened page gets a handle on window.opener and can
    // navigate this tab somewhere else
    it("always carry rel=noopener", () => {
        const offenders: string[] = [];

        for (const { path, text } of ALL_SOURCES) {
            // Each anchor that declares target="_blank", with the attributes
            // that surround it in the same jsx element
            const anchors = text.match(/<a\b[\s\S]*?>/g) ?? [];

            for (const anchor of anchors) {
                if (!anchor.includes('target="_blank"')) continue;
                if (!anchor.includes("noopener")) {
                    offenders.push(`${path.replace(SRC, "src")}: ${anchor}`);
                }
            }
        }

        expect(offenders).toEqual([]);
    });
});

describe("the content security policy the build injects", () => {
    const policy = buildContentSecurityPolicy("https://api.spp.test");
    const directive = (name: string) =>
        policy
            .split("; ")
            .find((entry) => entry.startsWith(`${name} `) || entry === name) ??
        "";

    it("keeps scripts on this origin only", () => {
        expect(directive("script-src")).toBe("script-src 'self'");
    });

    it("does not allow unsafe-inline or unsafe-eval for scripts", () => {
        expect(directive("script-src")).not.toContain("unsafe-inline");
        expect(directive("script-src")).not.toContain("unsafe-eval");
    });

    it("blocks plugins and restricts the document base", () => {
        expect(directive("object-src")).toBe("object-src 'none'");
        expect(directive("base-uri")).toBe("base-uri 'self'");
    });

    it("only lets forms post back to this origin", () => {
        expect(directive("form-action")).toBe("form-action 'self'");
    });

    it("only reaches the api it was built against", () => {
        expect(directive("connect-src")).toBe(
            "connect-src 'self' https://api.spp.test"
        );
    });

    it("only frames the no cookie youtube host", () => {
        expect(directive("frame-src")).toBe(
            "frame-src https://www.youtube-nocookie.com"
        );
    });

    it("falls back to self when no api url is configured", () => {
        expect(buildContentSecurityPolicy(undefined)).toContain(
            "connect-src 'self'"
        );
        expect(buildContentSecurityPolicy(undefined)).not.toContain(
            "connect-src 'self' "
        );
    });

    it("keeps a default-src that is not a wildcard", () => {
        expect(directive("default-src")).toBe("default-src 'self'");
        expect(policy).not.toContain("*");
    });
});

describe("third party code", () => {
    it("loads no script from a remote host in the html shell", () => {
        const html = readFileSync(join(process.cwd(), "index.html"), "utf8");
        const remote = html.match(/<script[^>]+src=["']https?:\/\/[^"']+/g);

        expect(remote).toBeNull();
    });

    // Fonts are bundled through @fontsource rather than fetched at runtime,
    // which is what lets font-src stay 'self'
    it("pulls no stylesheet or font from a remote host", () => {
        const html = readFileSync(join(process.cwd(), "index.html"), "utf8");

        expect(html).not.toContain("fonts.googleapis.com");
        expect(html).not.toContain("fonts.gstatic.com");
    });

    it("has no analytics or tag manager snippet", () => {
        const html = readFileSync(join(process.cwd(), "index.html"), "utf8");
        const all = [html, ...ALL_SOURCES.map(({ text }) => text)].join("\n");

        for (const marker of [
            "googletagmanager",
            "google-analytics",
            "gtag(",
            "hotjar",
            "mixpanel",
            "segment.com",
            "facebook.net",
        ]) {
            expect(all).not.toContain(marker);
        }
    });
});
