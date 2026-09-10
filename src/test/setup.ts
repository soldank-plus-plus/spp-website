import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";

// The default is one second, which a coverage run can miss: instrumentation
// slows the suite down several times over, and a query that was going to
// succeed then fails on the clock rather than on the assertion
configure({ asyncUtilTimeout: 5_000 });

// jsdom implements neither of these, and the shadcn sidebar and the radix
// primitives call them during a normal render
if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
        ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            addListener: () => {},
            removeListener: () => {},
            dispatchEvent: () => false,
        }) as unknown as MediaQueryList;
}

if (!window.ResizeObserver) {
    window.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}

afterEach(() => {
    cleanup();
});
