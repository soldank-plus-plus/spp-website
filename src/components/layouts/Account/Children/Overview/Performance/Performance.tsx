"use client";

import React from "react";
import Completed from "@/components/layouts/Account/Children/Overview/Performance/Completed";
import MedalCard from "@/components/layouts/Account/Children/Overview/Performance/MedalCard";
import Placement from "@/components/layouts/Account/Children/Overview/Performance/Placement";
import { AccountUser } from "@/types/user";

const TOTAL_MAPS = 200;

interface Props {
    user: AccountUser;
}

const Performance: React.FC<Props> = ({ user }) => {
    return (
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-0 space-y-5 sm:space-y-6">
            <h3>Performance</h3>

            <div className="flex flex-col md:flex-row items-stretch gap-5 max-w-3xl mx-auto">
                <div className="flex-1 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 via-white/10 to-white/5 p-5">
                    <Completed completed={user.unique_caps} maxMaps={TOTAL_MAPS} />
                </div>
                <div className="min-w-[150px] rounded-xl border border-white/10 bg-gradient-to-b from-white/5 via-white/10 to-white/5 p-5">
                    <MedalCard medals={{ gold: user.gold, silver: user.silver, bronze: user.bronze }} />
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <Placement ranking={user.placement} />
            </div>


        </div>
    );
};

export default Performance;
