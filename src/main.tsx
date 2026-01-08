import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/hooks/ScrollToTop";
import "./index.css";

import { appRoutes, AppRoute } from "@/config/Routes";

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
        <BrowserRouter>
            <ScrollToTop />
            <Routes>{renderRoutes(appRoutes)}</Routes>
        </BrowserRouter>
    </React.StrictMode>
);
