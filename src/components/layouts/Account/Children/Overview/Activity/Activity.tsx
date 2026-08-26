"use client";

import React, { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/shadcn/tooltip";
import { usersApi } from "@/api/users";
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
    const [data, setData] = useState<ActivityDay[]>([]);
    const [loading, setLoading] = useState(true);

    const handleFilterChange = (newFilter: ActivityFilter) => {
        setFilter(newFilter);
        setLoading(true);
    };

    useEffect(() => {
        const controller = new AbortController();
        usersApi
            .getUserActivity(userId, filter, controller.signal)
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                if (err?.name !== "AbortError") setLoading(false);
            });
        return () => controller.abort();
    }, [userId, filter]);

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
