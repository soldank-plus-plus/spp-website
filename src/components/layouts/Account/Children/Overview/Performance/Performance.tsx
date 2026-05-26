"use client";

import React, { useMemo } from "react";
import Completed from "@/components/layouts/Account/Children/Overview/Performance/Completed";
import MedalCard from "@/components/layouts/Account/Children/Overview/Performance/MedalCard";
import Placement from "@/components/layouts/Account/Children/Overview/Performance/Placement";
import { Activity } from "@/components/layouts/Account/Children/Overview/Activity/Activity";
import { AccountUser } from "@/types/user";

const TOTAL_MAPS = 200;

function generateActivity(seed: number) {
    const today = new Date();
    const data = [];
    const rng = (n: number) => Math.abs(Math.sin(seed + n) * 10) % 12;

    for (let i = 0; i < 120; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i * 3);
        const count = Math.floor(rng(i));
        if (count > 0) {
            data.push({ day: d.toISOString().slice(0, 10), count });
        }
    }
    return data;
}

interface Props {
    user: AccountUser;
}

const Performance: React.FC<Props> = ({ user }) => {
    const activityData = useMemo(() => generateActivity(user.id), [user.id]);

    return (
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-0 space-y-5 sm:space-y-6">
            <h3>Performance</h3>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
                <Completed completed={user.unique_caps} maxMaps={TOTAL_MAPS} />
                <MedalCard medals={{ gold: user.gold, silver: user.silver, bronze: user.bronze }} />
            </div>

            <div className="pt-2 sm:pt-0">
                <Placement ranking={user.placement} />
            </div>

            <div className="pt-2 sm:pt-4">
                <Activity data={activityData} />
            </div>
        </div>
    );
};

export default Performance;
