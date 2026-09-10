import { beforeEach, describe, expect, it } from "vitest";
import { act } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { renderHookWithRouter } from "@/test/render";
import { installJsonFetch } from "@/test/fetchMock";
import { useMapFlags, type MapFlag } from "@/hooks/maps/useMapFlags";
import { useGameFilters } from "@/hooks/gamemodes/useGameFilters";
import { useGamemode } from "@/hooks/gamemodes/useGamemode";
import { XSS_PAYLOADS, DANGEROUS_URLS, EXTERNAL_URLS } from "@/test/payloads";

// The read side is covered in queryParams.test.tsx. These cover the write
// side: what these hooks put back into the url, which is the part that ends
// up in a link a visitor can copy and send to someone else
beforeEach(() => {
    installJsonFetch({ body: { data: [] } });
});

const withLocation = <T,>(useHook: () => T, route: string) =>
    renderHookWithRouter(() => ({ hook: useHook(), location: useLocation() }), {
        route,
    });

describe("toggling a map flag", () => {
    it("writes only the allowlisted key into the url", () => {
        const probe = withLocation(useMapFlags, "/maps");

        act(() => probe.current().hook.toggleFlag("jets"));

        expect(probe.current().location.search).toBe("?flags=jets");
        expect(probe.current().hook.flags).toEqual(["jets"]);
    });

    it("drops a hostile value already in the url when it writes back", () => {
        const probe = withLocation(
            useMapFlags,
            `/maps?flags=${encodeURIComponent("<script>x</script>,jets")}`
        );

        act(() => probe.current().hook.toggleFlag("m79"));

        const search = probe.current().location.search;

        expect(search).not.toContain("script");
        expect(search).not.toContain("%3C");
        expect(new URLSearchParams(search).get("flags")).toBe("jets,m79");
    });

    it("removes the parameter entirely when the last flag is cleared", () => {
        const probe = withLocation(useMapFlags, "/maps?flags=jets");

        act(() => probe.current().hook.clearFlags());

        expect(probe.current().location.search).toBe("");
    });

    it("leaves an unrelated parameter untouched", () => {
        const probe = withLocation(useMapFlags, "/maps?page=3&gamemode=climb");

        act(() => probe.current().hook.toggleFlag("coop"));

        const params = new URLSearchParams(probe.current().location.search);

        expect(params.get("page")).toBe("3");
        expect(params.get("gamemode")).toBe("climb");
        expect(params.get("flags")).toBe("coop");
    });

    // A caller outside the allowlist should not be able to smuggle a value in
    it.each([...XSS_PAYLOADS, ...DANGEROUS_URLS])(
        "never reads back %j after a write",
        (payload) => {
            const probe = withLocation(
                useMapFlags,
                `/maps?flags=${encodeURIComponent(payload)}`
            );

            act(() => probe.current().hook.toggleFlag("jets"));

            expect(probe.current().hook.flags).toEqual(["jets"]);
            expect(probe.current().location.search).toBe("?flags=jets");
        }
    );

    it("round trips every declared flag", () => {
        const flags: MapFlag[] = ["anticoop", "jets", "m79", "nade"];

        for (const flag of flags) {
            const probe = withLocation(useMapFlags, "/maps");

            act(() => probe.current().hook.toggleFlag(flag));

            expect(probe.current().hook.flags).toEqual([flag]);
        }
    });
});

describe("toggling a game filter", () => {
    it("writes only the allowlisted style", () => {
        const probe = withLocation(useGameFilters, "/gamemodes");

        act(() => probe.current().hook.toggleStyle("aim"));

        expect(probe.current().location.search).toBe("?styles=aim");
    });

    it("drops a hostile style already in the url when it writes back", () => {
        const probe = withLocation(
            useGameFilters,
            `/gamemodes?styles=${encodeURIComponent("javascript:alert(1),aim")}`
        );

        act(() => probe.current().hook.toggleStyle("movement"));

        const search = probe.current().location.search;

        expect(search).not.toContain("javascript");
        expect(new URLSearchParams(search).get("styles")).toBe("aim,movement");
    });

    it("clears the parameter when the last style is turned off", () => {
        const probe = withLocation(useGameFilters, "/gamemodes?styles=aim");

        act(() => probe.current().hook.toggleStyle("aim"));

        expect(probe.current().location.search).toBe("");
    });

    it("writes a feature the same way", () => {
        const probe = withLocation(useGameFilters, "/gamemodes");

        act(() => probe.current().hook.toggleFeature("multiplayer"));

        expect(probe.current().location.search).toBe("?features=multiplayer");
    });
});

describe("switching gamemode", () => {
    // setGamemode takes a slug from the picker rather than from the url, but
    // whatever it is handed still has to end up encoded in the query string
    it.each([...XSS_PAYLOADS, ...EXTERNAL_URLS])(
        "encodes %j into the query string rather than the path",
        (payload) => {
            const probe = withLocation(useGamemode, "/ranking");

            act(() => probe.current().hook.setGamemode(payload));

            const { pathname, search } = probe.current().location;

            expect(pathname).toBe("/ranking");
            expect(new URLSearchParams(search).get("gamemode")).toBe(payload);
            expect(search).not.toContain("<");
            expect(search).not.toContain('"');
        }
    );

    it("keeps other parameters when it switches", () => {
        const probe = withLocation(useGamemode, "/ranking?page=2");

        act(() => probe.current().hook.setGamemode("ctf"));

        const params = new URLSearchParams(probe.current().location.search);

        expect(params.get("page")).toBe("2");
        expect(params.get("gamemode")).toBe("ctf");
    });
});
