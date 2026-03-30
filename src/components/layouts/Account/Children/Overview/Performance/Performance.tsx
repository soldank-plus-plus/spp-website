"use client";

import React from "react";
import Completed from "@/components/layouts/Account/Children/Overview/Performance/Completed";
import MedalCard from "@/components/layouts/Account/Children/Overview/Performance/MedalCard";
import Placement from "@/components/layouts/Account/Children/Overview/Performance/Placement";
import { Activity } from "@/components/layouts/Account/Children/Overview/Activity/Activity";

const MAX_MAPS = 3300;

const exampleStats = {
    username: "PlayerOne",
    points: 1300,
    gold: 20,
    silver: 5,
    bronze: 3,
    no_medal: 1272,
    playtime: 360000,
    ranking: {
        records: 42,
        hardest: 15,
        golds: 78,
    },
};

const sampleActivityData = [
    { day: "2026-03-24", count: 5 },
    { day: "2026-03-23", count: 2 },
    { day: "2026-03-22", count: 7 },
    { day: "2026-03-21", count: 1 },
];

const Performance: React.FC = () => {
    const handleDayClick = (day: string, count: number) => {
        console.log(`Clicked on ${day} with ${count} routes`);
    };

    const medals = {
        gold: exampleStats.gold,
        silver: exampleStats.silver,
        bronze: exampleStats.bronze,
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-0 space-y-5 sm:space-y-6">
            <h3 className="text-lg sm:text-xl">Performance</h3>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
                <Completed points={exampleStats.points} maxMaps={MAX_MAPS} />
                <MedalCard medals={medals} />
            </div>

            {exampleStats.ranking && (
                <div className="pt-2 sm:pt-0">
                    <Placement ranking={exampleStats.ranking} />
                </div>
            )}

            <div className="pt-2 sm:pt-4">
                <Activity
                    data={sampleActivityData}
                    onDayClick={handleDayClick}
                />
            </div>
        </div>
    );
};

export default Performance;
