import React from "react";
import { PiRanking } from "react-icons/pi";
import { GiMountainClimbing } from "react-icons/gi";
import { CiTrophy } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";

export interface NavSubItem {
    label: string;
    path: string;
}

export interface NavItem {
    label: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: NavSubItem[];
}

export const navStructure: NavItem[] = [
    {
        label: "Rankings",
        icon: <PiRanking className="h-5 w-5" />,
        subItems: [
            "Climbed maps",
            "Gold medals",
            "Hardest maps",
            "Duels won",
        ].map((item) => ({
            label: item,
            path: `/gameplay/${item.toLowerCase().replace(/\s+/g, "-")}`,
        })),
    },
    {
        label: "Records",
        icon: <GiMountainClimbing className="h-5 w-5" />,
        subItems: ["Latest climbs", "Positions obtained", "Coops"].map(
            (item) => ({
                label: item,
                path: `/gameplay/${item.toLowerCase().replace(/\s+/g, "-")}`,
            })
        ),
    },
    {
        label: "Tournaments",
        icon: <CiTrophy className="h-5 w-5" />,
        subItems: ["2026"].map((item) => ({
            label: item,
            path: `/gameplay/${item.toLowerCase().replace(/\s+/g, "-")}`,
        })),
    },
    {
        label: "Account",
        icon: <MdAccountCircle className="h-5 w-5" />,
        subItems: [
            "Climbing records",
            "Your medals",
            "Maps created",
            "Clan info",
        ].map((item) => ({
            label: item,
            path: `/gameplay/${item.toLowerCase().replace(/\s+/g, "-")}`,
        })),
    },
];
