import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import User from "@/pages/User/User";
import { Maplist } from "@/components/layouts/Maps/Maplist/Maplist";
import { ErrorBoundary } from "@/components/ui/custom/core/ErrorBoundary";
import { renderWithProviders } from "@/test/render";
import {
    fakeResponse,
    installFailingFetch,
    installFetch,
} from "@/test/fetchMock";
import { expectNoExecutableMarkup, resetXssFlag } from "@/test/domSecurity";
import { XSS_PAYLOADS } from "@/test/payloads";

// Strings that should never reach the page, whatever the backend sends
const INTERNAL_MARKERS = [
    "node_modules",
    "at Object.",
    "QueryFailedError",
    "/app/src/",
    "postgres://",
    "localhost:5432",
    "internal-api.local",
    "Bearer ",
    "eyJhbGciOi",
];

const expectNoInternals = (text: string) => {
    for (const marker of INTERNAL_MARKERS) {
        expect(text).not.toContain(marker);
    }
};

beforeEach(resetXssFlag);

describe("a failed request on the profile page", () => {
    it("shows a generic message when the network is down", async () => {
        installFailingFetch(
            new TypeError("Failed to fetch http://internal-api.local:3000/x")
        );

        const { container } = renderWithProviders(<User />, {
            route: "/profile/player",
            path: "/profile/:username",
        });

        await waitFor(() =>
            expect(screen.getByText("Network error")).toBeInTheDocument()
        );

        expectNoInternals(container.textContent ?? "");
    });

    it("does not paint a leaked stack trace into the page", async () => {
        installFetch(() =>
            fakeResponse({
                status: 500,
                body: {
                    statusCode: 500,
                    message:
                        "QueryFailedError: relation users does not exist\n    at Parser.parseErrorMessage (/app/node_modules/pg/lib/parser.js:287:98)",
                },
            })
        );

        const { container } = renderWithProviders(<User />, {
            route: "/profile/player",
            path: "/profile/:username",
        });

        await waitFor(() =>
            expect(screen.getByText("Failed to fetch user")).toBeInTheDocument()
        );

        expectNoInternals(container.textContent ?? "");
    });

    it("does not paint a leaked credential into the page", async () => {
        installFetch(() =>
            fakeResponse({
                status: 500,
                body: {
                    statusCode: 500,
                    message:
                        "connect failed for postgres://spp:hunter2@localhost:5432/climb",
                },
            })
        );

        const { container } = renderWithProviders(<User />, {
            route: "/profile/player",
            path: "/profile/:username",
        });

        await waitFor(() =>
            expect(screen.getByText("Failed to fetch user")).toBeInTheDocument()
        );

        expect(container.textContent ?? "").not.toContain("hunter2");
        expectNoInternals(container.textContent ?? "");
    });

    // A short backend message is still rendered, and it is attacker
    // influenced, so it has to stay text
    it.each(XSS_PAYLOADS)(
        "keeps the error message %j inert",
        async (payload) => {
            installFetch(() =>
                fakeResponse({
                    status: 400,
                    body: { statusCode: 400, message: payload },
                })
            );

            const { container } = renderWithProviders(<User />, {
                route: "/profile/player",
                path: "/profile/:username",
            });

            await waitFor(() =>
                expect(container.querySelector(".text-red-500")).toBeTruthy()
            );

            expectNoExecutableMarkup(container);
        }
    );
});

describe("a failed request on the map list", () => {
    it("shows a generic message rather than the transport failure", async () => {
        installFailingFetch(
            new TypeError("Failed to fetch http://internal-api.local:3000/x")
        );

        const { container } = renderWithProviders(<Maplist />);

        await waitFor(() =>
            expect(screen.getByText("Network error")).toBeInTheDocument()
        );

        expectNoInternals(container.textContent ?? "");
    });
});

describe("the error boundary", () => {
    const Boom: React.FC = () => {
        // React reports a boundary catch on stderr, so the marker is
        // obviously synthetic rather than something that reads like a real
        // credential in a ci log
        throw new Error("spp-internal-detail-marker");
    };

    it("catches a thrown render error instead of blanking the page", () => {
        const original = console.error;
        console.error = vi.fn();

        try {
            renderWithProviders(
                <ErrorBoundary>
                    <Boom />
                </ErrorBoundary>
            );
        } finally {
            console.error = original;
        }

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("does not reveal the thrown message", () => {
        const original = console.error;
        console.error = vi.fn();

        let container: HTMLElement;
        try {
            ({ container } = renderWithProviders(
                <ErrorBoundary>
                    <Boom />
                </ErrorBoundary>
            ));
        } finally {
            console.error = original;
        }

        const text = container!.textContent ?? "";

        expect(text).not.toContain("spp-internal-detail-marker");
        expectNoInternals(text);
    });

    it("renders its children untouched when nothing throws", () => {
        renderWithProviders(
            <ErrorBoundary>
                <p>all good</p>
            </ErrorBoundary>
        );

        expect(screen.getByText("all good")).toBeInTheDocument();
        expect(
            screen.queryByText("Something went wrong")
        ).not.toBeInTheDocument();
    });
});

describe("console use", () => {
    it("does not log the response body on a failed request", async () => {
        const spy = vi.spyOn(console, "log").mockImplementation(() => {});
        const errorSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        installFetch(() =>
            fakeResponse({
                status: 500,
                body: { statusCode: 500, message: "Bearer eyJhbGciOiJIUzI1" },
            })
        );

        renderWithProviders(<User />, {
            route: "/profile/player",
            path: "/profile/:username",
        });

        await waitFor(() =>
            expect(screen.getByText("Failed to fetch user")).toBeInTheDocument()
        );

        const logged = [...spy.mock.calls, ...errorSpy.mock.calls]
            .flat()
            .map(String)
            .join(" ");

        expect(logged).not.toContain("eyJhbGciOiJIUzI1");
    });
});
