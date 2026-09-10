import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/shadcn/sidebar";
import { renderWithProviders } from "@/test/render";
import { appSources, grepSources } from "@/test/sources";
import { expectNoExecutableMarkup, resetXssFlag } from "@/test/domSecurity";
import { HUGE_STRING, XSS_PAYLOADS } from "@/test/payloads";

const SOURCES = appSources();

const clearCookies = () => {
    for (const entry of document.cookie.split(";")) {
        const name = entry.split("=")[0]?.trim();
        if (name) document.cookie = `${name}=; path=/; max-age=0`;
    }
};

beforeEach(() => {
    resetXssFlag();
    clearCookies();
    localStorage.clear();
    sessionStorage.clear();
});

afterEach(clearCookies);

describe("what the frontend keeps in the browser", () => {
    // This app has no accounts and no session, so nothing should be written
    // to web storage at all. The scan is the regression guard: whoever adds
    // the first write has to come past this test and justify it
    it("writes nothing to localStorage or sessionStorage", () => {
        const writes = grepSources(
            /\b(localStorage|sessionStorage)\s*[.[]/,
            SOURCES
        );

        expect(writes).toEqual([]);
    });

    it("stores no token, key or secret anywhere in the client", () => {
        const suspicious = grepSources(
            /\b(access_?token|refresh_?token|api_?key|client_?secret|Authorization)\b/i,
            SOURCES
        );

        expect(suspicious).toEqual([]);
    });

    it("sets only the one sidebar cookie", () => {
        const writes = grepSources(/document\.cookie\s*=/, SOURCES);

        expect(writes).toHaveLength(1);
        expect(writes[0]).toContain("SIDEBAR_COOKIE_NAME");
    });
});

describe("the sidebar cookie", () => {
    const renderSidebar = () =>
        renderWithProviders(
            <SidebarProvider>
                <Sidebar />
                <SidebarTrigger />
            </SidebarProvider>
        );

    it("records only the open state, never anything about the visitor", async () => {
        const user = userEvent.setup();
        renderSidebar();

        await user.click(screen.getByRole("button"));

        const value = document.cookie
            .split(";")
            .map((entry) => entry.trim())
            .find((entry) => entry.startsWith("sidebar_state="))
            ?.split("=")[1];

        expect(["true", "false"]).toContain(value);
    });

    it("renders normally when a hostile value is already set", () => {
        for (const payload of XSS_PAYLOADS) {
            document.cookie = `sidebar_state=${encodeURIComponent(payload)}; path=/`;

            const { container, unmount } = renderSidebar();

            expectNoExecutableMarkup(container);
            unmount();
        }
    });

    it("renders normally when the cookie is corrupt, empty or enormous", () => {
        for (const value of [
            "",
            "%%%",
            "null",
            "undefined",
            "{",
            HUGE_STRING,
        ]) {
            document.cookie = `sidebar_state=${encodeURIComponent(value)}; path=/`;

            const { container, unmount } = renderSidebar();

            expect(container.querySelector("[data-slot], div")).toBeTruthy();
            unmount();
        }
    });

    it("renders when cookies are unavailable entirely", () => {
        const descriptor = Object.getOwnPropertyDescriptor(
            Document.prototype,
            "cookie"
        );

        Object.defineProperty(document, "cookie", {
            configurable: true,
            get: () => {
                throw new Error("cookies are blocked");
            },
            set: () => {
                throw new Error("cookies are blocked");
            },
        });

        try {
            const { container } = renderSidebar();
            expect(container).toBeTruthy();
        } finally {
            if (descriptor) {
                Object.defineProperty(document, "cookie", descriptor);
            }
        }
    });
});

describe("storage that a hostile page could have poisoned", () => {
    // Nothing reads web storage today, so the app has to be indifferent to
    // whatever is sitting in it
    it("is unaffected by junk already in localStorage", () => {
        localStorage.setItem("user", '{"role":"admin"}');
        localStorage.setItem("token", "eyJhbGciOiJIUzI1NiJ9.evil");
        localStorage.setItem("__proto__", '{"isAdmin":true}');

        const { container } = renderWithProviders(
            <SidebarProvider>
                <Sidebar />
            </SidebarProvider>
        );

        expectNoExecutableMarkup(container);
        expect(({} as Record<string, unknown>)["isAdmin"]).toBeUndefined();
    });

    it("throws nothing when storage itself is unavailable", () => {
        const spy = vi
            .spyOn(Storage.prototype, "getItem")
            .mockImplementation(() => {
                throw new Error("storage disabled");
            });

        try {
            const { container } = renderWithProviders(
                <SidebarProvider>
                    <Sidebar />
                </SidebarProvider>
            );
            expect(container).toBeTruthy();
        } finally {
            spy.mockRestore();
        }
    });
});
