"use client";

import React from "react";
import Completed from "@/components/layouts/Account/Children/Overview/Performance/Completed";
import MedalCard from "@/components/layouts/Account/Children/Overview/Performance/MedalCard";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { AccountUser } from "@/types/user";

const TOTAL_MAPS = 200;

interface Props {
    user?: AccountUser;
    loading?: boolean;
}

const Performance: React.FC<Props> = ({ user, loading }) => {
    if (loading || !user)
        return (
            <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-0 space-y-5 sm:space-y-6">
                <Skeleton className="h-6 w-32" />

                <div className="flex flex-col md:flex-row items-stretch gap-5 max-w-3xl mx-auto">
                    <div className="flex-1 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 via-white/10 to-white/5 p-5 flex flex-col gap-4 justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col gap-1.5 min-w-[70px]">
                                <Skeleton className="h-8 w-14" />
                                <Skeleton className="h-3 w-10" />
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <Skeleton className="h-2 w-full rounded-full" />
                                <Skeleton className="h-3 w-10 ml-auto" />
                            </div>
                        </div>
                        <Skeleton className="h-px w-full opacity-30" />
                        <div className="flex items-baseline gap-2">
                            <Skeleton className="h-6 w-10" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>

                    <div className="min-w-[150px] rounded-xl border border-white/10 bg-gradient-to-b from-white/5 via-white/10 to-white/5 p-5 flex flex-col gap-3">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                </div>

                <div className="grid grid-cols-3 text-center max-w-3xl mx-auto rounded-xl border border-white/10 bg-gradient-to-b from-white/5 via-white/10 to-white/5 overflow-hidden">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center gap-2 py-4 px-3"
                        >
                            <Skeleton className="h-8 w-12" />
                            <Skeleton className="h-3 w-14" />
                        </div>
                    ))}
                </div>
            </div>
        );

    return (
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-0 space-y-5 sm:space-y-6">
            <h3>Performance</h3>

            <div className="flex flex-col md:flex-row items-stretch gap-5 max-w-3xl mx-auto">
                <div className="flex-1 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 via-white/10 to-white/5 p-5">
                    <Completed
                        completed={user.uniqueCaps ?? 0}
                        maxMaps={TOTAL_MAPS}
                    />
                </div>
                <div className="min-w-[150px] rounded-xl border border-white/10 bg-gradient-to-b from-white/5 via-white/10 to-white/5 p-5">
                    <MedalCard
                        medals={{
                            gold: user.gold ?? 0,
                            silver: user.silver ?? 0,
                            bronze: user.bronze ?? 0,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Performance;
