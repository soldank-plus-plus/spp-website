"use client";

import React, { useState } from "react";
import { TooltipProvider } from "@/components/ui/shadcn/tooltip";
import { useUsersControllerFindActivity } from "@/api/generated/sppComponents";
import {
    ActivityFilter,
    PALETTE,
    generateCalendar,
    getMonthLabels,
} from "./activityTypes";
import { ActivityFilters } from "./ActivityFilters";
import { ActivityGrid } from "./ActivityGrid";

function formatMonth(day: string): string {
    return new Date(`${day}T00:00:00Z`).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
}

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
    const data = response?.data ?? [];

    const palette = PALETTE[filter];
    const latestDay = data.reduce(
        (latest, entry) => (entry.day > latest ? entry.day : latest),
        ""
    );
    const days = generateCalendar(latestDay || undefined);
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
    const firstDay = days[0];
    const lastDay = days[days.length - 1];

    return (
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-0 mt-16 rounded-xl">
            <div className="my-5 flex flex-wrap items-baseline gap-x-3">
                <h3>Activity</h3>
                {!loading && firstDay && lastDay && (
                    <span className="text-xs text-secondary">
                        {formatMonth(firstDay)} to {formatMonth(lastDay)}
                    </span>
                )}
            </div>

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
