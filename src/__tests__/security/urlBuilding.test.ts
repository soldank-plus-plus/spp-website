import { describe, expect, it } from "vitest";
import {
    encodePath,
    encodeSegment,
    mapDataUrl,
    mapFileUrl,
    mapScreenshotUrl,
    mapTextureUrl,
    normalizePath,
    safeFileName,
} from "@/utils/mapUrl";
import {
    DANGEROUS_URLS,
    ENCODED_XSS_PAYLOADS,
    EXTERNAL_URLS,
    HUGE_STRING,
    MALFORMED_VALUES,
    PATH_TRAVERSAL_PAYLOADS,
    UNICODE_PAYLOADS,
    XSS_PAYLOADS,
} from "@/test/payloads";
import { isDangerousUrl } from "@/test/domSecurity";

const BUILDERS: {
    name: string;
    build: (untrusted: string) => string;
    prefix: string;
}[] = [
    {
        name: "mapFileUrl (category)",
        build: (value) => mapFileUrl(value, "kamikaze"),
        prefix: "/mapviewer/data/",
    },
    {
        name: "mapFileUrl (mapname)",
        build: (value) => mapFileUrl("climb", value),
        prefix: "/mapviewer/data/climb/maps/",
    },
    {
        name: "mapTextureUrl (texture)",
        build: (value) => mapTextureUrl("climb", value),
        prefix: "/mapviewer/data/climb/textures/",
    },
    {
        name: "mapScreenshotUrl (mapname)",
        build: (value) => mapScreenshotUrl("climb", value),
        prefix: "/mapviewer/screenshots/",
    },
    {
        name: "mapScreenshotUrl (category)",
        build: (value) => mapScreenshotUrl(value, "kamikaze"),
        prefix: "/mapviewer/screenshots/",
    },
    {
        name: "mapDataUrl (path)",
        build: (value) => mapDataUrl("climb", value),
        prefix: "/mapviewer/data/climb/",
    },
    {
        name: "mapDataUrl (category)",
        build: (value) => mapDataUrl(value, "maps/kamikaze.pms"),
        prefix: "/mapviewer/data/",
    },
];

const ALL_UNTRUSTED = [
    ...PATH_TRAVERSAL_PAYLOADS,
    ...DANGEROUS_URLS,
    ...EXTERNAL_URLS,
    ...XSS_PAYLOADS,
    ...ENCODED_XSS_PAYLOADS,
    ...UNICODE_PAYLOADS,
    ...MALFORMED_VALUES,
];

// The one origin every generated asset url has to stay on
const ORIGIN = "https://spp.test";

describe.each(BUILDERS)("$name", ({ build, prefix }) => {
    it.each(ALL_UNTRUSTED)("stays under the asset prefix for %j", (value) => {
        const built = build(value);

        expect(built.startsWith(prefix)).toBe(true);
    });

    it.each(ALL_UNTRUSTED)("resolves to the same origin for %j", (value) => {
        const resolved = new URL(build(value), ORIGIN);

        expect(resolved.origin).toBe(ORIGIN);
        expect(resolved.pathname.startsWith("/mapviewer/")).toBe(true);
    });

    it.each(ALL_UNTRUSTED)(
        "never escapes the asset prefix once resolved for %j",
        (value) => {
            // The browser normalises "." and ".." before it sends the request,
            // so the check that matters is on the resolved path rather than on
            // the string the builder returned. Asserting the full prefix here
            // rather than just "/mapviewer/" is what catches a segment that
            // climbs one directory instead of all the way out
            const { pathname } = new URL(build(value), ORIGIN);

            expect(pathname).not.toContain("/../");
            expect(pathname.startsWith(prefix)).toBe(true);
        }
    );

    it.each(ALL_UNTRUSTED)(
        "never grows a query or fragment for %j",
        (value) => {
            const { search, hash } = new URL(build(value), ORIGIN);

            expect(search).toBe("");
            expect(hash).toBe("");
        }
    );

    it.each(ALL_UNTRUSTED)(
        "never yields an executable scheme for %j",
        (value) => {
            expect(isDangerousUrl(build(value))).toBe(false);
        }
    );
});

describe("encodeSegment", () => {
    it("keeps a single name in a single path segment", () => {
        expect(encodeSegment("a/b")).toBe("a%2Fb");
        expect(encodeSegment("../secret")).toBe("..%2Fsecret");
    });

    it("neutralises the characters that would restructure a url", () => {
        expect(encodeSegment("a?x=1")).toBe("a%3Fx%3D1");
        expect(encodeSegment("a#frag")).toBe("a%23frag");
        expect(encodeSegment("a&b=c")).toBe("a%26b%3Dc");
    });

    it("round trips back to the original name", () => {
        for (const value of [...UNICODE_PAYLOADS, ...XSS_PAYLOADS]) {
            expect(decodeURIComponent(encodeSegment(value))).toBe(value);
        }
    });

    it("keeps a name that merely contains dots intact", () => {
        expect(encodeSegment("map.v2")).toBe("map.v2");
        expect(encodeSegment("..foo")).toBe("..foo");
        expect(encodeSegment("foo..")).toBe("foo..");
    });

    it("leaves ordinary map names readable", () => {
        expect(encodeSegment("kamikaze")).toBe("kamikaze");
        expect(encodeSegment("climb")).toBe("climb");
    });
});

describe("encodePath", () => {
    it("keeps real directory separators", () => {
        expect(encodePath("scenery-gfx/tree.bmp")).toBe("scenery-gfx/tree.bmp");
        expect(encodePath("textures/edges/stone.bmp")).toBe(
            "textures/edges/stone.bmp"
        );
    });

    it("drops the segments that would climb out of the directory", () => {
        expect(encodePath("../../../etc/passwd")).toBe("etc/passwd");
        expect(encodePath("a/./b")).toBe("a/b");
        expect(encodePath("..")).toBe("");
        expect(encodePath("//evil.example/x")).toBe("evil.example/x");
    });

    it("encodes each segment it keeps", () => {
        expect(encodePath("maps/a?x=1.pms")).toBe("maps/a%3Fx%3D1.pms");
    });
});

describe("hostile input that is not a url at all", () => {
    it("survives a very long name without throwing", () => {
        const built = mapFileUrl("climb", HUGE_STRING);

        expect(built.startsWith("/mapviewer/data/climb/maps/")).toBe(true);
        expect(new URL(built, ORIGIN).origin).toBe(ORIGIN);
    });

    it("survives a lone surrogate rather than throwing URIError", () => {
        // encodeURIComponent throws on an unpaired surrogate, which would take
        // the whole page down on a malformed name from the api
        expect(() => mapFileUrl("climb", "\ud800")).not.toThrow();
    });
});

describe("normalizePath", () => {
    // The zip entry names go through this rather than through the encoder, so
    // a downloaded archive cannot write outside the folder it is unpacked into
    it.each(PATH_TRAVERSAL_PAYLOADS)(
        "leaves no traversal segment in %j",
        (value) => {
            const normalized = normalizePath(`maps/${value}.pms`);

            expect(normalized.split("/")).not.toContain("..");
            expect(normalized.split("/")).not.toContain(".");
            expect(normalized.startsWith("/")).toBe(false);
        }
    );

    it("keeps an ordinary entry name readable", () => {
        expect(normalizePath("maps/kamikaze.pms")).toBe("maps/kamikaze.pms");
        expect(normalizePath("scenery-gfx/tree.bmp")).toBe(
            "scenery-gfx/tree.bmp"
        );
    });

    it("does not percent encode, unlike the url builder", () => {
        expect(normalizePath("maps/a b.pms")).toBe("maps/a b.pms");
    });
});

describe("safeFileName", () => {
    it("keeps an ordinary download name intact", () => {
        expect(safeFileName("kamikaze (Kamikaze by nubs)")).toBe(
            "kamikaze (Kamikaze by nubs)"
        );
    });

    it.each([
        ["../../evil", "_.._evil"],
        ["a/b", "a_b"],
        ["a\\b", "a_b"],
        ["....", "map"],
        ["", "map"],
        ["   ", "map"],
        ["  .hidden", "hidden"],
        ["a:b", "a_b"],
        ['a"b', "a_b"],
        ["a<b>c", "a_b_c"],
        ["a|b", "a_b"],
    ])("turns %j into %j", (input, expected) => {
        expect(safeFileName(input)).toBe(expected);
    });

    it("strips the control characters a save dialog would not show", () => {
        expect(safeFileName("report\u0000.exe")).toBe("report_.exe");
        expect(safeFileName("a\nb")).toBe("a_b");
        expect(safeFileName("a\u007fb")).toBe("a_b");
    });

    it("caps the length so the extension stays visible", () => {
        expect(safeFileName(HUGE_STRING).length).toBeLessThanOrEqual(100);
    });

    it.each([...XSS_PAYLOADS, ...UNICODE_PAYLOADS, ...DANGEROUS_URLS])(
        "never yields a path separator for %j",
        (value) => {
            const name = safeFileName(value);

            expect(name).not.toContain("/");
            expect(name).not.toContain("\\");
            expect(name.startsWith(".")).toBe(false);
        }
    );
});
