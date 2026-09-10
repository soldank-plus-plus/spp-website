import { describe, expect, it, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { parseRouteId } from "@/utils/routeParams";
import Map from "@/pages/Map/Map";
import Clan from "@/pages/Clan/Clan";
import Gamemode from "@/pages/Gamemodes/Children/Gamemode";
import { renderWithProviders } from "@/test/render";
import { installJsonFetch } from "@/test/fetchMock";
import { expectNoExecutableMarkup, resetXssFlag } from "@/test/domSecurity";
import {
    DANGEROUS_URLS,
    ENCODED_XSS_PAYLOADS,
    EXTERNAL_URLS,
    MALFORMED_VALUES,
    PATH_TRAVERSAL_PAYLOADS,
    UNICODE_PAYLOADS,
    XSS_PAYLOADS,
} from "@/test/payloads";

beforeEach(() => {
    resetXssFlag();
    installJsonFetch({ body: { data: [], meta: { totalPages: 1 } } });
});

describe("parseRouteId", () => {
    it("accepts a plain positive integer", () => {
        expect(parseRouteId("1")).toBe(1);
        expect(parseRouteId("4210")).toBe(4210);
    });

    // Each of these passes the `!isNaN(Number(v))` check the pages used to
    // rely on, and would have been sent to the api as a real lookup
    it.each([
        ["0x10", "hex literal silently meaning 16"],
        ["1e3", "exponent silently meaning 1000"],
        ["", "empty string coercing to 0"],
        [" ", "whitespace coercing to 0"],
        ["\t\n", "whitespace coercing to 0"],
        ["Infinity", "non finite id"],
        ["-Infinity", "non finite id"],
        ["-1", "negative id"],
        ["1.5", "fractional id"],
        ["+1", "signed id"],
        ["1 ", "trailing whitespace"],
        [" 1", "leading whitespace"],
        ["0", "row ids start at 1"],
        ["999999999999999999999999", "beyond a safe integer"],
    ])("rejects %j (%s)", (value) => {
        expect(parseRouteId(value)).toBeNull();
    });

    it.each([
        ...PATH_TRAVERSAL_PAYLOADS,
        ...XSS_PAYLOADS,
        ...ENCODED_XSS_PAYLOADS,
        ...DANGEROUS_URLS,
        ...EXTERNAL_URLS,
        ...UNICODE_PAYLOADS,
        ...MALFORMED_VALUES,
    ])("rejects the hostile id %j", (value) => {
        expect(parseRouteId(value)).toBeNull();
    });

    it("rejects a missing param", () => {
        expect(parseRouteId(undefined)).toBeNull();
    });
});

describe("map page id param", () => {
    const renderAt = (id: string) =>
        renderWithProviders(<Map />, {
            route: `/maps/${id}`,
            path: "/maps/:mapId",
        });

    it.each(["0x10", "1e3", "-1", "Infinity", "abc", "1.5", "0"])(
        "redirects instead of fetching for %j",
        (id) => {
            renderAt(id);

            expect(screen.getByText("redirected")).toBeInTheDocument();
        }
    );

    it("renders the page for a real id", () => {
        renderAt("42");

        expect(screen.queryByText("redirected")).not.toBeInTheDocument();
    });

    // The old page called navigate() from the render body, so React ran the
    // side effect during rendering and StrictMode ran it twice
    it("redirects without a render phase side effect", () => {
        const errors: unknown[] = [];
        const original = console.error;
        console.error = (...args: unknown[]) => errors.push(args);

        try {
            renderAt("not-an-id");
        } finally {
            console.error = original;
        }

        expect(
            errors.filter((entry) =>
                String(entry).includes("Cannot update a component")
            )
        ).toEqual([]);
    });
});

describe("clan page id param", () => {
    it.each(["0x10", "1e3", "-1", "Infinity", "abc", "0"])(
        "redirects instead of fetching for %j",
        (id) => {
            renderWithProviders(<Clan />, {
                route: `/clans/${id}`,
                path: "/clans/:clanId",
            });

            expect(screen.getByText("redirected")).toBeInTheDocument();
        }
    );
});

describe("clan page with a real id", () => {
    it("renders the page instead of redirecting", () => {
        renderWithProviders(<Clan />, {
            route: "/clans/12",
            path: "/clans/:clanId",
        });

        expect(screen.queryByText("redirected")).not.toBeInTheDocument();
    });
});

describe("gamemode slug param", () => {
    // findGame looks the slug up in a fixed list, so anything unknown has to
    // land on the not found page rather than being echoed back
    it.each([...XSS_PAYLOADS, ...PATH_TRAVERSAL_PAYLOADS, ...DANGEROUS_URLS])(
        "does not render %j as markup",
        (slug) => {
            const { container } = renderWithProviders(<Gamemode />, {
                route: `/gamemodes/${encodeURIComponent(slug)}`,
                path: "/gamemodes/:slug",
            });

            expectNoExecutableMarkup(container);
        }
    );
});
