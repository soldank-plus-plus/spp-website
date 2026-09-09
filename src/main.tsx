import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollToTop from "@/hooks/core/ScrollToTop";
import "@fontsource/tomorrow/400.css";
import "@fontsource/tomorrow/500.css";
import "@fontsource/tomorrow/700.css";
import "./index.css";

import { appRoutes, AppRoute } from "@/config/Routes";

// Stats change rarely, so a minute of freshness saves a request on every
// remount, tab switch and page revisit
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function renderRoutes(routes: AppRoute[]) {
    return routes.map(({ path, element, children }, idx) => (
        <Route key={path ?? `route-${idx}`} path={path} element={element}>
            {children &&
                children.map((child, cIdx) => (
                    <Route
                        key={child.path ?? `child-${cIdx}`}
                        index={child.index}
                        path={child.path}
                        element={child.element}
                    />
                ))}
        </Route>
    ));
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ScrollToTop />
                <Routes>{renderRoutes(appRoutes)}</Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
