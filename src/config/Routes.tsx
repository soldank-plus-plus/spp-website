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
import { Global } from "@/components/layouts/Ranking/Global/Global";
import { Country } from "@/components/layouts/Ranking/Country/Country";
import { Clan } from "@/components/layouts/Ranking/Clan/Clan";
import { Records } from "@/components/layouts/Ranking/Records/Records";
import { Positions } from "@/components/layouts/Ranking/Positions/Positions";
import { More } from "@/components/layouts/Ranking/More/More";

// Layouts / misc
import EarlyAccess from "@/components/layouts/Landing/Buttons/EarlyAccess";
import Contributing from "@/components/layouts/Landing/Buttons/Contributing";
import Commits from "@/components/layouts/Landing/Buttons/Commits";
import Hosting from "@/components/layouts/Servers/YourServer/Hosting/Hosting";
import Roadmap from "@/components/layouts/Faq/Roadmap/Roadmap";
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
