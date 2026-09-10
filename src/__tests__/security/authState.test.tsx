import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import Signup from "@/pages/Account/Signup";
import { appRoutes } from "@/config/Routes";
import { renderWithProviders } from "@/test/render";
import { appSources, grepSources } from "@/test/sources";

const SOURCES = appSources();

// This frontend has no accounts, no session and no authorisation of its own.
// Accounts are created in the game, the backend has no auth yet, and
// AGENTS.md records that the mutating user routes are deliberately absent.
//
// So there is nothing here to test for session expiry, logout, role gated
// screens or protected routes. What these tests do instead is pin that
// absence: the day someone adds a token, a role check or a guarded route,
// one of these fails and the security review happens then rather than never.
describe("the app holds no session state", () => {
    it("has no auth context, provider or hook", () => {
        const found = grepSources(
            /\b(AuthContext|AuthProvider|useAuth|useSession|useCurrentUser|SessionProvider)\b/,
            SOURCES
        );

        expect(found).toEqual([]);
    });

    it("has no login, logout or token handling", () => {
        const found = grepSources(
            /\b(signIn|signOut|logIn|logOut|handleLogin|handleLogout|refreshToken|setToken|getToken|clearSession)\s*[(=]/,
            SOURCES
        );

        expect(found).toEqual([]);
    });

    it("sends no credentials with a request", () => {
        const found = grepSources(
            /credentials:\s*["'](include|same-origin)["']|withCredentials/,
            SOURCES
        );

        expect(found).toEqual([]);
    });

    it("sets no authorization header on the api client", () => {
        const fetcher = SOURCES.find(({ relative }) =>
            relative.endsWith("sppFetcher.ts")
        );

        expect(fetcher?.text).not.toMatch(/Authorization/i);
        expect(fetcher?.text).not.toMatch(/\bBearer\b/);
    });
});

describe("the app makes no authorisation decision", () => {
    it("branches on no role or permission", () => {
        const found = grepSources(
            /\b(isAdmin|isModerator|isStaff|hasRole|hasPermission|hasAnyRole|permissions|userRole)\b\s*[.([)=?]/,
            SOURCES
        );

        expect(found).toEqual([]);
    });

    it("has no route guard or protected route wrapper", () => {
        const found = grepSources(
            /\b(ProtectedRoute|PrivateRoute|RequireAuth|AuthGuard|RequireRole)\b/,
            SOURCES
        );

        expect(found).toEqual([]);
    });

    // Every route is public, so a direct url is the same as a click. This
    // asserts the route table itself carries no guard, which is what would
    // make the two differ
    it("declares every route without a guard", () => {
        const paths = appRoutes.map((route) => route.path);

        expect(paths).toContain("/");
        expect(paths).toContain("/ranking");
        expect(paths).toContain("*");

        for (const route of appRoutes) {
            expect(route).not.toHaveProperty("guard");
            expect(route).not.toHaveProperty("requiresAuth");
            expect(route).not.toHaveProperty("roles");
        }
    });
});

describe("the signup page", () => {
    // The only account related screen. It collects nothing, which is what
    // keeps it out of scope for credential handling
    it("renders no form, input or password field", () => {
        const { container } = renderWithProviders(<Signup />);

        expect(container.querySelector("form")).toBeNull();
        expect(container.querySelector("input")).toBeNull();
        expect(container.querySelector('input[type="password"]')).toBeNull();
    });

    it("explains that accounts are made in the game", () => {
        renderWithProviders(<Signup />);

        expect(
            screen.getByText(/only way to create an account/i)
        ).toBeInTheDocument();
    });
});

describe("the api surface the frontend calls", () => {
    // AGENTS.md: PUT/DELETE on a user are deliberately not implemented
    // because the backend has no auth. Nothing here may call them
    it("issues no mutating user request", () => {
        const found = grepSources(
            /useUsersController(Update|Remove|Delete|Create)/,
            SOURCES
        );

        expect(found).toEqual([]);
    });

    it("issues no write request at all", () => {
        const found = grepSources(
            /method:\s*["'](post|put|patch|delete)["']/i,
            SOURCES
        );

        expect(found).toEqual([]);
    });
});
