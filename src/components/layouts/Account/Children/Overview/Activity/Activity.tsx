"use client";

import React, { useState } from "react";
import { TooltipProvider } from "@/components/ui/shadcn/tooltip";
import { useUsersControllerFindActivity } from "@/api/generated/sppComponents";
import { ActivityDay } from "@/types/user";
import {
    ActivityFilter,
    PALETTE,
    generateCalendar,
    getMonthLabels,
} from "./activityTypes";
import { ActivityFilters } from "./ActivityFilters";
import { ActivityGrid } from "./ActivityGrid";

type Props = {
    userId: number;
    onDayClick?: (day: string, count: number) => void;
};

export const Activity: React.FC<Props> = ({ userId, onDayClick }) => {
    const [filter, setFilter] = useState<ActivityFilter>("records");

    const handleFilterChange = (newFilter: ActivityFilter) => {
        setFilter(newFilter);
    };

    const { data: response, isPending: loading } =
        useUsersControllerFindActivity({
            pathParams: { id: userId },
            queryParams: { type: filter },
        });
    // The backend actually returns { data: ActivityDayDto[] }, but the
    // generated type only reflects a single ActivityDayDto since
    // @Serialize doesn't declare isArray on this endpoint.
    const envelope = response as unknown as { data: ActivityDay[] } | undefined;
    const data = envelope?.data ?? [];

    const palette = PALETTE[filter];
    const days = generateCalendar();
    const activityMap: Record<string, number> = {};
    data.forEach((d) => (activityMap[d.day] = d.count));

    const weeks: string[][] = [];
    let currentWeek: string[] = [];
    days.forEach((day) => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length) weeks.push(currentWeek);

    const months = getMonthLabels(days);

    return (
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-0 mt-16 rounded-xl">
            <h3 className="my-5">Activity</h3>

            <TooltipProvider>
                <div className="space-y-3">
                    <ActivityFilters
                        filter={filter}
                        onFilterChange={handleFilterChange}
                    />
                    <ActivityGrid
                        weeks={weeks}
                        months={months}
                        activityMap={activityMap}
                        palette={palette}
                        onDayClick={onDayClick}
                        loading={loading}
                    />
                </div>
            </TooltipProvider>
        </div>
    );
};
