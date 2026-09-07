import React from "react";

// Pages
import Landing from "@/pages/Landing/Landing";
import Gameplay from "@/pages/Gameplay/Gameplay";
import Ranking from "@/pages/Ranking/Ranking";
import Maps from "@/pages/Maps/Maps";
import Map from "@/pages/Map/Map";
import Clan from "@/pages/Clan/Clan";
import Mapviewer from "@/pages/Map/Children/Mapviewer";
import Gamemodes from "@/pages/Gamemodes/Gamemodes";
import Gamemode from "@/pages/Gamemodes/Children/Gamemode";
import Servers from "@/pages/Servers/Servers";
import Faq from "@/pages/Faq/Faq";

// Auth
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";

// User
import User from "@/pages/User/User";
import { Overview } from "@/pages/User/Children/Overview";
import { UserClan } from "@/pages/User/Children/UserClan";
import { UserRecords } from "@/pages/User/Children/UserRecords";
import { UserPositions } from "@/pages/User/Children/UserPositions";
import { Medals } from "@/pages/User/Children/Medals";
import { UserMaps } from "@/pages/User/Children/UserMaps";

// Ranking
import { Global } from "@/pages/Ranking/Children/Climb/Global";
import { Country } from "@/pages/Ranking/Children/Climb/Country";
import { GlobalClan } from "@/pages/Ranking/Children/Climb/GlobalClan";
import { GlobalRecords } from "@/pages/Ranking/Children/Climb/GlobalRecords";
import { GlobalPositions } from "@/pages/Ranking/Children/Climb/GlobalPositions";
import { More } from "@/pages/Ranking/Children/Climb/More";

// Layouts / misc
import EarlyAccess from "@/pages/Landing/Children/EarlyAccess/EarlyAccess";
import Contributing from "@/pages/Landing/Children/Contributing/Contributing";
import Hosting from "@/pages/Servers/Children/Hosting";
import Roadmap from "@/pages/Faq/Children/Roadmap/Roadmap";
import NotFound from "@/components/ui/custom/core/NotFound";

export interface AppRoute {
    path?: string;
    index?: boolean;
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
        element: <User />,
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

    { path: "/clans/:clanId", element: <Clan /> },

    { path: "/maps", element: <Maps /> },
    { path: "/maps/:mapId", element: <Map /> },
    { path: "/mapviewer", element: <Mapviewer /> },
    { path: "/gamemodes", element: <Gamemodes /> },
    { path: "/gamemodes/:slug", element: <Gamemode /> },
    { path: "/servers", element: <Servers /> },
    { path: "/faq", element: <Faq /> },

    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },

    { path: "/earlyaccess", element: <EarlyAccess /> },
    { path: "/contributing", element: <Contributing /> },
    { path: "/hosting", element: <Hosting /> },
    { path: "/roadmap", element: <Roadmap /> },
];
