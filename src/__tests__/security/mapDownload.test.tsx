import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Hero } from "@/components/layouts/Map/Hero";
import { renderWithProviders } from "@/test/render";
import { installFetch, fakeResponse } from "@/test/fetchMock";
import { PATH_TRAVERSAL_PAYLOADS, XSS_PAYLOADS } from "@/test/payloads";

// The download button turns ?name= and ?category= into a list of urls to
// fetch and a set of names to put in a zip, which makes it the widest use of
// those two query params anywhere in the app
vi.mock("@/hooks/maps/useMapData", () => ({
    useMapData: () => ({
        mapInfo: {
            name: "Kamikaze",
            texture: "stone.bmp",
            images: ["tree.bmp"],
            scenery_counts: [1],
        },
        edgeslist: ["stone.bmp"],
        loading: false,
        loadError: false,
    }),
}));

const anchors: HTMLAnchorElement[] = [];

beforeEach(() => {
    anchors.length = 0;

    // jsdom implements neither, and the component needs both to build the file
    URL.createObjectURL = vi.fn(() => "blob:test");
    URL.revokeObjectURL = vi.fn();
    vi.spyOn(window, "alert").mockImplementation(() => {});

    // Capture the anchor the component builds, and stop the click so jsdom
    // does not try to navigate to the blob
    const appendChild = document.body.appendChild.bind(document.body);
    vi.spyOn(document.body, "appendChild").mockImplementation((node) => {
        if (node instanceof HTMLAnchorElement) {
            anchors.push(node);
            node.click = () => {};
        }
        return appendChild(node);
    });

    installFetch(() => fakeResponse({ rawBody: "data", contentType: "text" }));
});

const download = async (mapname: string, category = "climb") => {
    const user = userEvent.setup();

    renderWithProviders(
        <Hero mapId={1} mapname={mapname} category={category} />
    );

    await user.click(screen.getByRole("button", { name: "Download" }));
    await waitFor(() => expect(anchors).toHaveLength(1));

    return anchors[0]!;
};

const fetchedUrls = () =>
    (window.fetch as unknown as { mock: { calls: [string][] } }).mock.calls.map(
        ([url]) => String(url)
    );

// The rendered Hero also asks the api for the map record, which goes to the
// configured base url rather than to the static asset directory
const API_BASE = "http://localhost:3000";

const assetUrls = () =>
    fetchedUrls().filter((url) => !url.startsWith(API_BASE));

// Nothing may be requested except the api and the mapviewer data directory
const expectOnlyExpectedHosts = () => {
    for (const url of fetchedUrls()) {
        expect(
            url.startsWith(API_BASE) || url.startsWith("/mapviewer/data/")
        ).toBe(true);
    }
};

describe("the map download", () => {
    it.each([...PATH_TRAVERSAL_PAYLOADS, ...XSS_PAYLOADS])(
        "keeps every request under the data directory for the map name %j",
        async (payload) => {
            await download(payload);

            expectOnlyExpectedHosts();

            for (const url of assetUrls()) {
                const resolved = new URL(url, "https://spp.test");

                expect(resolved.origin).toBe("https://spp.test");
                expect(
                    resolved.pathname.startsWith("/mapviewer/data/climb/")
                ).toBe(true);
                expect(resolved.pathname).not.toContain("/../");
                expect(resolved.search).toBe("");
            }
        }
    );

    it.each(PATH_TRAVERSAL_PAYLOADS)(
        "keeps every request under the data directory for the category %j",
        async (payload) => {
            await download("kamikaze", payload);

            expectOnlyExpectedHosts();

            for (const url of assetUrls()) {
                const resolved = new URL(url, "https://spp.test");

                expect(resolved.origin).toBe("https://spp.test");
                expect(resolved.pathname.startsWith("/mapviewer/data/")).toBe(
                    true
                );
                expect(resolved.pathname).not.toContain("/../");
            }
        }
    );

    // A saved archive must not be able to write outside where it is unpacked
    it.each([...PATH_TRAVERSAL_PAYLOADS, ...XSS_PAYLOADS])(
        "gives the saved file a name with no path in it for %j",
        async (payload) => {
            const anchor = await download(payload);

            expect(anchor.download).not.toContain("/");
            expect(anchor.download).not.toContain("\\");
            expect(anchor.download.startsWith(".")).toBe(false);
            expect(anchor.download.endsWith(".zip")).toBe(true);
        }
    );

    it("keeps the ordinary download name readable", async () => {
        const anchor = await download("kamikaze");

        expect(anchor.download).toBe("kamikaze (Kamikaze).zip");
    });

    it("fetches the map, its texture and its scenery for a normal name", async () => {
        await download("kamikaze");

        const urls = assetUrls();

        expect(urls).toContain("/mapviewer/data/climb/maps/kamikaze.pms");
        expect(urls).toContain("/mapviewer/data/climb/textures/stone.bmp");
        expect(urls).toContain("/mapviewer/data/climb/scenery-gfx/tree.bmp");
    });
});
