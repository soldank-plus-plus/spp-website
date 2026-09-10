import { beforeEach, describe, expect, it } from "vitest";
import { renderHookWithRouter, renderWithProviders } from "@/test/render";
import { installJsonFetch } from "@/test/fetchMock";
import { useMapFlags, MAP_FLAGS } from "@/hooks/maps/useMapFlags";
import { useGameFilters, GAME_STYLES } from "@/hooks/gamemodes/useGameFilters";
import { useGamemode } from "@/hooks/gamemodes/useGamemode";
import { Filtering } from "@/components/layouts/Servers/Fetching/Filtering";
import { expectNoExecutableMarkup, resetXssFlag } from "@/test/domSecurity";
import {
    DANGEROUS_URLS,
    ENCODED_XSS_PAYLOADS,
    EXTERNAL_URLS,
    HUGE_STRING,
    PATH_TRAVERSAL_PAYLOADS,
    UNICODE_PAYLOADS,
    XSS_PAYLOADS,
} from "@/test/payloads";

const HOSTILE = [
    ...XSS_PAYLOADS,
    ...ENCODED_XSS_PAYLOADS,
    ...DANGEROUS_URLS,
    ...EXTERNAL_URLS,
    ...PATH_TRAVERSAL_PAYLOADS,
];

beforeEach(() => {
    resetXssFlag();
    installJsonFetch({ body: { data: [] } });
});

describe("?flags= is an allowlist", () => {
    it.each(HOSTILE)("drops the unknown flag %j", (payload) => {
        const hook = renderHookWithRouter(useMapFlags, {
            route: `/maps?flags=${encodeURIComponent(payload)}`,
        });

        expect(hook.current().flags).toEqual([]);
    });

    it("keeps only the known keys out of a mixed list", () => {
        const hook = renderHookWithRouter(useMapFlags, {
            route: "/maps?flags=jets,<script>x</script>,m79,../../etc",
        });

        expect(hook.current().flags).toEqual(["jets", "m79"]);
    });

    it("never returns anything outside the declared set", () => {
        const known = MAP_FLAGS.map((flag) => flag.key);
        const hook = renderHookWithRouter(useMapFlags, {
            route: `/maps?flags=${encodeURIComponent(
                [...known, ...HOSTILE].join(",")
            )}`,
        });

        for (const flag of hook.current().flags) {
            expect(known).toContain(flag);
        }
    });

    it("survives a very long value", () => {
        const hook = renderHookWithRouter(useMapFlags, {
            route: `/maps?flags=${HUGE_STRING}`,
        });

        expect(hook.current().flags).toEqual([]);
    });

    it("treats a missing param as no flags", () => {
        expect(renderHookWithRouter(useMapFlags).current().flags).toEqual([]);
    });
});

describe("?styles= and ?features= are allowlists", () => {
    it.each(HOSTILE)("drops the unknown style %j", (payload) => {
        const hook = renderHookWithRouter(useGameFilters, {
            route: `/gamemodes?styles=${encodeURIComponent(payload)}`,
        });

        expect(hook.current().styles).toEqual([]);
    });

    it.each(HOSTILE)("drops the unknown feature %j", (payload) => {
        const hook = renderHookWithRouter(useGameFilters, {
            route: `/gamemodes?features=${encodeURIComponent(payload)}`,
        });

        expect(hook.current().features).toEqual([]);
    });

    it("keeps only the known styles out of a mixed list", () => {
        const hook = renderHookWithRouter(useGameFilters, {
            route: "/gamemodes?styles=aim,<img src=x onerror=1>,movement",
        });

        expect(hook.current().styles).toEqual(["aim", "movement"]);
    });

    it("never returns anything outside the declared set", () => {
        const known = GAME_STYLES.map((style) => style.key);
        const hook = renderHookWithRouter(useGameFilters, {
            route: `/gamemodes?styles=${encodeURIComponent(
                [...known, ...HOSTILE].join(",")
            )}`,
        });

        for (const style of hook.current().styles) {
            expect(known).toContain(style);
        }
    });
});

describe("?gamemode= is resolved against the backend list", () => {
    // An unknown slug has to fall back rather than being taken at face value,
    // otherwise the value in the url decides what the page asks the api for
    it.each(HOSTILE)("does not accept the unknown slug %j", (payload) => {
        const hook = renderHookWithRouter(useGamemode, {
            route: `/ranking?gamemode=${encodeURIComponent(payload)}`,
        });

        const current = hook.current().gamemode;
        expect(current === null || current.slug !== payload).toBe(true);
    });
});

describe("server list filtering reads ?gamemode=", () => {
    it.each([...HOSTILE, ...UNICODE_PAYLOADS])(
        "renders %j without producing markup",
        (payload) => {
            const { container } = renderWithProviders(
                <Filtering data={[]} onChange={() => {}} />,
                { route: `/servers?gamemode=${encodeURIComponent(payload)}` }
            );

            expectNoExecutableMarkup(container);
        }
    );

    it("does not crash on a very long gamemode value", () => {
        const { container } = renderWithProviders(
            <Filtering data={[]} onChange={() => {}} />,
            { route: `/servers?gamemode=${HUGE_STRING}` }
        );

        expectNoExecutableMarkup(container);
    });
});

describe("the free text server filter", () => {
    it.each([...XSS_PAYLOADS, ...UNICODE_PAYLOADS])(
        "keeps the typed value %j out of the markup",
        (payload) => {
            const rows = [
                {
                    gamemode: payload,
                    server: payload,
                    players: "1/8",
                    map: payload,
                    latency: "10ms",
                },
            ];

            const { container } = renderWithProviders(
                <Filtering data={rows} onChange={() => {}} />
            );

            expectNoExecutableMarkup(container);
        }
    );
});
