import React from "react";

// Pages
import Landing from "@/pages/Landing/Landing";
import Gameplay from "@/pages/Gameplay/Gameplay";
import Ranking from "@/pages/Ranking/Ranking";
import Maps from "@/pages/Maps/Maps";
import Map from "@/pages/Map/Map";
import Mapviewer from "@/pages/Map/Children/Mapviewer";
import Gamemodes from "@/pages/Gamemodes/Gamemodes";
import Servers from "@/pages/Servers/Servers";
import Faq from "@/pages/Faq/Faq";

// Auth
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";

//Account
import Account from "@/pages/Account/Account";
import { Overview } from "@/pages/Account/Children/Overview";
import { UserClan } from "@/pages/Account/Children/UserClan";
import { UserRecords } from "@/pages/Account/Children/UserRecords";
import { UserPositions } from "@/pages/Account/Children/UserPositions";
import { Medals } from "@/pages/Account/Children/Medals";
import { UserMaps } from "@/pages/Account/Children/UserMaps";

// Ranking
import { Global } from "@/pages/Ranking/Children/Global";
import { Country } from "@/pages/Ranking/Children/Country";
import { GlobalClan } from "@/pages/Ranking/Children/GlobalClan";
import { GlobalRecords } from "@/pages/Ranking/Children/GlobalRecords";
import { GlobalPositions } from "@/pages/Ranking/Children/GlobalPositions";
import { More } from "@/pages/Ranking/Children/More";

// Layouts / misc
import EarlyAccess from "@/pages/Landing/Children/EarlyAccess/EarlyAccess";
import Contributing from "@/pages/Landing/Children/Contributing/Contributing";
import Hosting from "@/pages/Servers/Children/Hosting";
import Roadmap from "@/pages/Faq/Children/Roadmap/Roadmap";
import NotFound from "@/components/ui/custom/core/NotFound";

export interface AppRoute {
    path: string;
    element: React.ReactNode;
    icon?: React.ReactNode;
    children?: AppRoute[];
}

export const appRoutes: AppRoute[] = [
    { path: "/", element: <Landing /> },
    { path: "*", element: <NotFound /> },

    { path: "/gameplay", element: <Gameplay /> },
    {
        path: "/ranking",
        element: <Ranking />,
        children: [
            { index: true, element: <Global /> },
            { path: "global", element: <Global /> },
            { path: "country", element: <Country /> },
            { path: "clan", element: <GlobalClan /> },
            { path: "records", element: <GlobalRecords /> },
            { path: "positions", element: <GlobalPositions /> },
            { path: "more", element: <More /> },
        ],
    },

    {
        path: "/profile/:username",
        element: <Account />,
        children: [
            { index: true, element: <Overview /> },
            { path: "overview", element: <Overview /> },
            { path: "clan", element: <UserClan /> },
            { path: "records", element: <UserRecords /> },
            { path: "positions", element: <UserPositions /> },
            { path: "medals", element: <Medals /> },
            { path: "maps", element: <UserMaps /> },
        ],
    },

    { path: "/maps", element: <Maps /> },
    { path: "/maps/:mapId", element: <Map /> },
    { path: "/mapviewer", element: <Mapviewer /> },
    { path: "/gamemodes", element: <Gamemodes /> },
    { path: "/servers", element: <Servers /> },
    { path: "/faq", element: <Faq /> },

    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },

    { path: "/earlyaccess", element: <EarlyAccess /> },
    { path: "/contributing", element: <Contributing /> },
    { path: "/hosting", element: <Hosting /> },
    { path: "/roadmap", element: <Roadmap /> },
];
