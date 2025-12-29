import React from "react";

// Pages
import Landing from "@/pages/Landing/Landing";
import Gameplay from "@/pages/Gameplay/Gameplay";
import Ranking from "@/pages/Ranking/Ranking";
import Maps from "@/pages/Maps/Maps";
import Gamemodes from "@/pages/Gamemodes/Gamemodes";
import Servers from "@/pages/Servers/Servers";
import Faq from "@/pages/Faq/Faq";

// Auth
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";

// Ranking
import { Global } from "@/pages/Ranking/Children/Global";
import { Country } from "@/pages/Ranking/Children/Country";
import { Clan } from "@/pages/Ranking/Children/Clan";
import { Records } from "@/pages/Ranking/Children/Records";
import { Positions } from "@/pages/Ranking/Children/Positions";
import { More } from "@/pages/Ranking/Children/More";

// Layouts / misc
import EarlyAccess from "@/pages/Landing/Children/EarlyAccess/EarlyAccess";
import Contributing from "@/pages/Landing/Children/Contributing/Contributing";
import Commits from "@/pages/Landing/Children/Commits/Commits";
import Hosting from "@/pages/Servers/Children/Hosting";
import Roadmap from "@/pages/Faq/Children/Roadmap/Roadmap";
import NotFound from "@/components/sections/NotFound";

export interface AppRoute {
    path: string;
    element: React.ReactNode;
    label?: string; // sidebar label
    icon?: React.ReactNode;
    children?: AppRoute[];
    hidden?: boolean; // don’t show in sidebar
}

export const appRoutes: AppRoute[] = [
    { path: "/", element: <Landing />, hidden: true },
    { path: "*", element: <NotFound />, hidden: true },

    { path: "/gameplay", element: <Gameplay />, hidden: true },
    {
        path: "/ranking",
        element: <Ranking />, // wrapper z <Outlet />
        hidden: true,
        children: [
            { index: true, element: <Global /> }, // domyślnie Global na /ranking
            { path: "global", element: <Global /> },
            { path: "country", element: <Country /> },
            { path: "clan", element: <Clan /> },
            { path: "records", element: <Records /> },
            { path: "positions", element: <Positions /> },
            { path: "more", element: <More /> },
        ],
    },
    { path: "/maps", element: <Maps />, hidden: true },
    { path: "/gamemodes", element: <Gamemodes />, hidden: true },
    { path: "/servers", element: <Servers />, hidden: true },
    { path: "/faq", element: <Faq /> },

    { path: "/login", element: <Login />, hidden: true },
    { path: "/signup", element: <Signup />, hidden: true },

    { path: "/earlyaccess", element: <EarlyAccess />, hidden: true },
    { path: "/contributing", element: <Contributing />, hidden: true },
    { path: "/commits", element: <Commits />, hidden: true },
    { path: "/hosting", element: <Hosting />, hidden: true },
    { path: "/roadmap", element: <Roadmap />, hidden: true },
];
