"use client";

import React, { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/shadcn/tooltip";
import { useUsersControllerFindActivity } from "@/api/generated/sppComponents";
import {
    ActivityFilter,
    PALETTE,
    generateYear,
    getMonthLabels,
} from "./activityTypes";
import { ActivityFilters } from "./ActivityFilters";
import { ActivityGrid } from "./ActivityGrid";
import { ActivityYears } from "./ActivityYears";

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
    const [year, setYear] = useState<number>();

    const handleFilterChange = (newFilter: ActivityFilter) => {
        setFilter(newFilter);
    };

    // The backend picks the most recent year the player was active when no
    // year is asked for, and falls back to it when the filter has no such year
    const { data: response, isPending: loading } =
        useUsersControllerFindActivity(
            {
                pathParams: { id: userId },
                queryParams: { type: filter, year },
            },
            {
                // Keeps the squares on screen while the next year is being
                // fetched, and clicking through years already seen reads from
                // the cache instead of hitting the API again
                placeholderData: keepPreviousData,
                staleTime: 5 * 60 * 1000,
            }
        );
    const activity = response?.data;

    const palette = PALETTE[filter];
    const years = activity?.years ?? [];
    const selectedYear = activity?.year ?? new Date().getUTCFullYear();
    const days = generateYear(selectedYear);
    const activityMap: Record<string, number> = {};
    activity?.days.forEach((d) => (activityMap[d.day] = d.count));

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
    const filledDays = days.filter(Boolean);
    const firstDay = filledDays[0];
    const lastDay = filledDays[filledDays.length - 1];

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
                    <div className="flex items-start gap-4">
                        <div className="min-w-0 flex-1">
                            <ActivityGrid
                                weeks={weeks}
                                months={months}
                                activityMap={activityMap}
                                palette={palette}
                                onDayClick={onDayClick}
                                loading={loading}
                            />
                        </div>

                        {years.length > 0 && (
                            <ActivityYears
                                years={years}
                                year={selectedYear}
                                onYearChange={setYear}
                            />
                        )}
                    </div>
                </div>
            </TooltipProvider>
        </div>
    );
};
