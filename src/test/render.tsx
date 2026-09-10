import React from "react";
import { render, type RenderResult } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Retries would turn a mocked failure into several, and a shared cache would
// leak one test's response into the next
export const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false, staleTime: 0, gcTime: 0 },
        },
    });

interface Options {
    // The url the test navigates to, so route and query params arrive the way
    // the router hands them to a page rather than as hand built props
    route?: string;
    // The route pattern the element is mounted under, needed whenever the
    // component reads useParams
    path?: string;
}

export function renderWithProviders(
    ui: React.ReactNode,
    { route = "/", path }: Options = {}
): RenderResult {
    const client = createTestQueryClient();

    return render(
        <QueryClientProvider client={client}>
            <MemoryRouter initialEntries={[route]}>
                {path ? (
                    <Routes>
                        <Route path={path} element={ui} />
                        <Route path="*" element={<div>redirected</div>} />
                    </Routes>
                ) : (
                    ui
                )}
            </MemoryRouter>
        </QueryClientProvider>
    );
}

// Renders a hook inside the same providers and exposes whatever it returns,
// so query param hooks can be driven through a real router
export function renderHookWithRouter<T>(
    useHook: () => T,
    { route = "/", path = "*" }: Options = {}
): { current: () => T } {
    const box: { value: T | undefined } = { value: undefined };

    const Probe: React.FC = () => {
        box.value = useHook();
        return null;
    };

    renderWithProviders(<Probe />, { route, path });

    return { current: () => box.value as T };
}
