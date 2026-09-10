import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router-dom";
import { screen } from "@testing-library/react";
import { Table, TableBody } from "@/components/ui/shadcn/table";
import { UserRow } from "@/components/ui/custom/shared/Ranking/UserRow/UserRow";
import { ClanRow } from "@/components/ui/custom/shared/Ranking/ClanRow/ClanRow";
import MapCard from "@/components/layouts/Maps/Maplist/MapCard";
import { renderWithProviders } from "@/test/render";
import { installJsonFetch } from "@/test/fetchMock";
import { makeClan, makeMap, makeUser } from "@/test/fixtures";
import { appSources, grepSources } from "@/test/sources";
import { resetXssFlag } from "@/test/domSecurity";
import { DANGEROUS_URLS, EXTERNAL_URLS, XSS_PAYLOADS } from "@/test/payloads";

const SOURCES = appSources();

const ORIGIN = "http://localhost:3000";

// The default matcher trims and collapses whitespace, which would stop the
// payloads built out of whitespace from ever matching their own text node
const exact = (text: string) => text;

// Renders a probe next to the component so the test can read where the
// router actually ended up after a click
const LocationProbe: React.FC = () => {
    const { pathname, search } = useLocation();
    return <span data-testid="probe">{`${pathname}${search}`}</span>;
};

beforeEach(() => {
    resetXssFlag();
    installJsonFetch({ body: { data: [] } });
});

describe("the redirect surface", () => {
    // An open redirect needs somewhere that takes a destination from the
    // outside. These record that no such parameter exists, so adding one
    // brings a reviewer here first
    it("reads no redirect style query parameter anywhere", () => {
        const reads = grepSources(
            /(searchParams|params)\.get\(\s*["'](redirect|redirectTo|returnUrl|return_to|next|callback|continue|target|url|dest|destination)["']/i,
            SOURCES
        );

        expect(reads).toEqual([]);
    });

    it("assigns no location from a value it did not write itself", () => {
        const assignments = grepSources(
            /(window\.)?location(\.href)?\s*=|location\.(assign|replace)\s*\(/,
            SOURCES
        );

        // The one assignment is the login button, and it is a literal path
        expect(assignments).toHaveLength(1);
        expect(assignments[0]).toContain('"/signup"');
    });

    it("opens no window at a url built from untrusted input", () => {
        const opens = grepSources(/window\.open\s*\(/, SOURCES);

        // The mapviewer link is the only one, built from the map name and
        // category, and it stays on a relative path
        expect(opens).toHaveLength(1);

        const heroSource = SOURCES.find(({ relative }) =>
            relative.endsWith("layouts/Map/Hero.tsx")
        );

        expect(heroSource?.text).toContain(
            "window.open(\n                                `/mapviewer?map="
        );
    });

    it("navigates to no absolute url", () => {
        const absolute = grepSources(
            /navigate\(\s*[`"']https?:|navigate\(\s*[`"']\/\//,
            SOURCES
        );

        expect(absolute).toEqual([]);
    });
});

describe("row clicks that navigate with api supplied names", () => {
    const hostile = [...XSS_PAYLOADS, ...DANGEROUS_URLS, ...EXTERNAL_URLS];

    it.each(hostile)("keeps a username %j on this origin", async (payload) => {
        const user = userEvent.setup();

        renderWithProviders(
            <>
                {
                    <Table>
                        <TableBody>
                            <UserRow
                                player={makeUser({ username: payload })}
                                index={0}
                                currentPage={1}
                                pageSize={10}
                                sortBy="unique_caps"
                            />
                        </TableBody>
                    </Table>
                }
                <LocationProbe />
            </>
        );

        await user.click(screen.getByText(payload, { normalizer: exact }));

        const path = screen.getByTestId("probe").textContent ?? "";
        const resolved = new URL(path, ORIGIN);

        expect(resolved.origin).toBe(ORIGIN);
        expect(resolved.pathname.startsWith("/profile/")).toBe(true);
    });

    it.each(hostile)("keeps a clan name %j on this origin", async (payload) => {
        const user = userEvent.setup();

        renderWithProviders(
            <>
                <Table>
                    <TableBody>
                        <ClanRow
                            clan={makeClan({ clanname: payload })}
                            index={0}
                            currentPage={1}
                            pageSize={10}
                            sortBy="unique_caps"
                        />
                    </TableBody>
                </Table>
                <LocationProbe />
            </>
        );

        await user.click(screen.getByText(payload, { normalizer: exact }));

        const path = screen.getByTestId("probe").textContent ?? "";
        const resolved = new URL(path, ORIGIN);

        expect(resolved.origin).toBe(ORIGIN);
        expect(resolved.pathname.startsWith("/clans/")).toBe(true);
    });

    it.each(hostile)("keeps a map name %j on this origin", async (payload) => {
        const user = userEvent.setup();

        renderWithProviders(
            <>
                <MapCard
                    map={makeMap({ id: 7, mapname: payload })}
                    sortMode="latest"
                />
                <LocationProbe />
            </>
        );

        await user.click(
            screen.getByText(`#7 – ${payload}`, { normalizer: exact })
        );

        const path = screen.getByTestId("probe").textContent ?? "";
        const resolved = new URL(path, ORIGIN);

        expect(resolved.origin).toBe(ORIGIN);
        expect(resolved.pathname).toBe("/maps/7");
        // The name rides in the query string, where it cannot change the route
        expect(resolved.searchParams.get("name")).toBe(payload);
    });
});

describe("the login button", () => {
    it("points at a path on this site", () => {
        const header = SOURCES.find(({ relative }) =>
            relative.endsWith("core/Header.tsx")
        );

        const assignments = header?.text.match(/location\.href\s*=\s*./g) ?? [];

        expect(assignments).toHaveLength(1);
        // Assigned a string literal, never a variable holding a destination
        expect(assignments[0]).toMatch(/location\.href\s*=\s*"/);
        expect(header?.text).toContain('window.location.href = "/signup"');
    });
});
