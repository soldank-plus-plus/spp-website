import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { Table, TableBody } from "@/components/ui/shadcn/table";
import { Banner } from "@/components/ui/custom/shared/User/Banner/Banner";
import { UserRow } from "@/components/ui/custom/shared/Ranking/UserRow/UserRow";
import { ClanRow } from "@/components/ui/custom/shared/Ranking/ClanRow/ClanRow";
import MapCard from "@/components/layouts/Maps/Maplist/MapCard";
import { Preview } from "@/components/layouts/Map/Preview";
import { renderWithProviders } from "@/test/render";
import { makeClan, makeMap, makeUser } from "@/test/fixtures";
import {
    expectNoExecutableMarkup,
    expectRenderedAsInertText,
    resetXssFlag,
} from "@/test/domSecurity";
import {
    DANGEROUS_URLS,
    ENCODED_XSS_PAYLOADS,
    HUGE_STRING,
    UNICODE_PAYLOADS,
    XSS_PAYLOADS,
} from "@/test/payloads";

// Everything a hostile record could carry, in one list, so each component is
// checked against the same corpus
const ALL_PAYLOADS = [
    ...XSS_PAYLOADS,
    ...ENCODED_XSS_PAYLOADS,
    ...DANGEROUS_URLS,
];

beforeEach(resetXssFlag);

const inTable = (row: React.ReactNode) => (
    <Table>
        <TableBody>{row}</TableBody>
    </Table>
);

describe("UserRow renders an api supplied username", () => {
    it.each(ALL_PAYLOADS)("keeps %j inert", (payload) => {
        const { container } = renderWithProviders(
            inTable(
                <UserRow
                    player={makeUser({ username: payload })}
                    index={0}
                    currentPage={1}
                    pageSize={10}
                    sortBy="unique_caps"
                />
            )
        );

        expectRenderedAsInertText(container, payload);
    });

    it.each(UNICODE_PAYLOADS)("survives the unicode name %j", (payload) => {
        const { container } = renderWithProviders(
            inTable(
                <UserRow
                    player={makeUser({ username: payload })}
                    index={0}
                    currentPage={1}
                    pageSize={10}
                    sortBy="unique_caps"
                />
            )
        );

        expectNoExecutableMarkup(container);
    });
});

describe("ClanRow renders an api supplied clan name", () => {
    it.each(ALL_PAYLOADS)("keeps %j inert", (payload) => {
        const { container } = renderWithProviders(
            inTable(
                <ClanRow
                    clan={makeClan({ clanname: payload })}
                    index={0}
                    currentPage={1}
                    pageSize={10}
                    sortBy="unique_caps"
                />
            )
        );

        expectRenderedAsInertText(container, payload);
    });
});

describe("Banner renders api supplied profile fields", () => {
    it.each(ALL_PAYLOADS)("keeps the username %j inert", (payload) => {
        const { container } = renderWithProviders(
            <Banner avatarSrc="/avatar.png" username={payload} />
        );

        expectRenderedAsInertText(container, payload);
    });

    it.each(ALL_PAYLOADS)("keeps the clan name %j inert", (payload) => {
        const { container } = renderWithProviders(
            <Banner
                avatarSrc="/avatar.png"
                username="player"
                clanname={payload}
            />
        );

        expectRenderedAsInertText(container, payload);
    });

    // avatarSrc is handed a bundled asset by its only caller today, so this
    // guards a sink before it is wired to the api rather than closing a live
    // hole. The scheme is dropped rather than the image, so a bad value fails
    // to load the same way a wrong path already does
    it.each(DANGEROUS_URLS)("drops the avatar scheme %j", (payload) => {
        const { container } = renderWithProviders(
            <Banner avatarSrc={payload} username="player" />
        );

        expectNoExecutableMarkup(container);
        expect(container.querySelector("img")).toHaveAttribute("src", "");
    });

    it("leaves an ordinary avatar path untouched", () => {
        const { container } = renderWithProviders(
            <Banner avatarSrc="/assets/avatar.png" username="player" />
        );

        expect(container.querySelector("img")).toHaveAttribute(
            "src",
            "/assets/avatar.png"
        );
    });
});

describe("MapCard renders api supplied map data", () => {
    it.each(ALL_PAYLOADS)("keeps the map name %j inert", (payload) => {
        const { container } = renderWithProviders(
            <MapCard map={makeMap({ mapname: payload })} sortMode="hardest" />
        );

        expectRenderedAsInertText(container, payload);
    });

    it.each(ALL_PAYLOADS)("keeps a creator name %j inert", (payload) => {
        const { container } = renderWithProviders(
            <MapCard
                map={makeMap({ creators: [{ id: 1, username: payload }] })}
                sortMode="hardest"
            />
        );

        expectRenderedAsInertText(container, payload);
    });

    // The screenshot url is built from the map name, so the name must not be
    // able to point the <img> anywhere but the screenshots directory
    it.each([...ALL_PAYLOADS, ...UNICODE_PAYLOADS])(
        "keeps the screenshot on site for %j",
        (payload) => {
            const { container } = renderWithProviders(
                <MapCard
                    map={makeMap({ mapname: payload })}
                    sortMode="hardest"
                />
            );

            const image = container.querySelector("img");
            const src = image?.getAttribute("src") ?? "";

            expect(src.startsWith("/mapviewer/screenshots/")).toBe(true);
            expect(new URL(src, "https://spp.test").origin).toBe(
                "https://spp.test"
            );
        }
    );

    it("does not crash on a null map name", () => {
        const { container } = renderWithProviders(
            <MapCard map={makeMap({ mapname: null })} sortMode="hardest" />
        );

        expectNoExecutableMarkup(container);
    });

    it("does not crash on a very long map name", () => {
        const { container } = renderWithProviders(
            <MapCard
                map={makeMap({ mapname: HUGE_STRING })}
                sortMode="hardest"
            />
        );

        expectNoExecutableMarkup(container);
    });
});

describe("Preview builds its screenshot url from query params", () => {
    it.each([...ALL_PAYLOADS, ...UNICODE_PAYLOADS])(
        "keeps the image on site for the map name %j",
        (payload) => {
            const { container } = renderWithProviders(
                <Preview mapname={payload} category="climb" />
            );

            const src =
                container.querySelector("img")?.getAttribute("src") ?? "";

            expect(src.startsWith("/mapviewer/screenshots/")).toBe(true);
            expectNoExecutableMarkup(container);
        }
    );

    it.each(ALL_PAYLOADS)(
        "keeps the image on site for the category %j",
        (payload) => {
            const { container } = renderWithProviders(
                <Preview mapname="kamikaze" category={payload} />
            );

            const src =
                container.querySelector("img")?.getAttribute("src") ?? "";

            expect(src.startsWith("/mapviewer/screenshots/")).toBe(true);
            expectNoExecutableMarkup(container);
        }
    );

    it("renders nothing once the screenshot fails to load", () => {
        const { container } = renderWithProviders(
            <Preview mapname="kamikaze" category="climb" />
        );

        const image = container.querySelector("img")!;
        fireEvent.error(image);

        expect(container.querySelector("img")).toBeNull();
    });

    it("renders nothing for an empty map name", () => {
        const { container } = renderWithProviders(
            <Preview mapname="" category="climb" />
        );

        expect(container.querySelector("img")).toBeNull();
    });

    it("puts the raw name in alt text rather than in markup", () => {
        const payload = "<img src=x onerror=window.__xss=1>";
        renderWithProviders(<Preview mapname={payload} category="climb" />);

        expect(screen.getByAltText(payload)).toBeInTheDocument();
    });
});
