import React from "react";

// Pages
import Landing from "@/components/pages/Landing";
import Gameplay from "@/components/pages/Gameplay";
import Ranking from "@/components/pages/Ranking";
import Maps from "@/components/pages/Maps";
import Gamemodes from "@/components/pages/Gamemodes";
import Servers from "@/components/pages/Servers";
import Faq from "@/components/pages/Faq";

// Auth
import Login from "@/components/sections/Authentication/Login";
import Signup from "@/components/sections/Authentication/Signup";

// Layouts / misc
import EarlyAccess from "@/components/layouts/Landing/Buttons/EarlyAccess";
import Contributing from "@/components/layouts/Landing/Buttons/Contributing";
import Commits from "@/components/layouts/Landing/Buttons/Commits";
import Hosting from "@/components/layouts/Servers/YourServer/Hosting/Hosting";
import Roadmap from "@/components/layouts/Faq/Roadmap/Roadmap";
import NotFound from "@/components/sections/NotFound";

// Icons
import { PiRanking } from "react-icons/pi";
import { GiMountainClimbing } from "react-icons/gi";
import { CiTrophy } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";

export interface AppRoute {
    path: string;
    element: React.ReactNode;
    label?: string;       // sidebar label
    icon?: React.ReactNode;
    children?: AppRoute[];
    hidden?: boolean;     // don’t show in sidebar
}

export const appRoutes: AppRoute[] = [
    { path: "/", element: <Landing />, hidden: true },
    { path: "*", element: <NotFound />, hidden: true },

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

    // Sidebar in ranking page
    {
        path: "/ranking",
        element: <Ranking />,
        label: "Rankings",
        icon: <PiRanking className="h-5 w-5" />,
        children: [
            { path: "climbed-maps", element: <Gameplay />, label: "Climbed maps" },
            { path: "gold-medals", element: <Gameplay />, label: "Gold medals" },
            { path: "hardest-maps", element: <Gameplay />, label: "Hardest maps" },
            { path: "duels-won", element: <Gameplay />, label: "Duels won" },
        ],
    },

    {
        path: "/records",
        element: <Gameplay />,
        label: "Records",
        icon: <GiMountainClimbing className="h-5 w-5" />,
        children: [
            { path: "latest-climbs", element: <Gameplay />, label: "Latest climbs" },
            { path: "positions-obtained", element: <Gameplay />, label: "Positions obtained" },
            { path: "coops", element: <Gameplay />, label: "Coops" },
        ],
    },

    {
        path: "/tournaments",
        element: <Gameplay />,
        label: "Tournaments",
        icon: <CiTrophy className="h-5 w-5" />,
        children: [{ path: "2026", element: <Gameplay />, label: "2026" }],
    },

    {
        path: "/account",
        element: <Gameplay />,
        label: "Account",
        icon: <MdAccountCircle className="h-5 w-5" />,
        children: [
            { path: "climbing-records", element: <Gameplay />, label: "Climbing records" },
            { path: "your-medals", element: <Gameplay />, label: "Your medals" },
            { path: "maps-created", element: <Gameplay />, label: "Maps created" },
            { path: "clan-info", element: <Gameplay />, label: "Clan info" },
        ],
    },
];
