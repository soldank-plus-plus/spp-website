"use client";

import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";

type ActivityDay = {
    day: string; // YYYY-MM-DD
    count: number;
};

type Props = {
    data: ActivityDay[];
    onDayClick?: (day: string, count: number) => void;
};

function generateCalendar() {
    const today = new Date();
    const days: string[] = [];

    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
    }

    const remainder = days.length % 7;
    if (remainder > 0) {
        days.splice(0, remainder);
    }

    return days;
}

function getColor(count: number) {
    if (count === 0) return "bg-[#2a2a2a]";
    if (count < 3) return "bg-[#0d3f6d]";
    if (count < 6) return "bg-[#0a5ca0]";
    if (count < 10) return "bg-[#1e7ae6]";
    return "bg-[#4aa3ff]";
}

function getMonthLabels(days: string[]) {
    const labels: { index: number; label: string }[] = [];

    days.forEach((day, i) => {
        const date = new Date(day);
        if (date.getDate() === 1) {
            labels.push({
                index: i,
                label: date.toLocaleString("default", { month: "short" }),
            });
        }
    });

    return labels;
}

export const Activity: React.FC<Props> = ({ data, onDayClick }) => {
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
        <div className="w-full max-w-4xl mt-16 rounded-xl">
            <h3 className="my-5">Activity</h3>

            <TooltipProvider>
                <div className="space-y-3">
                    <div className="flex gap-[3px] pl-[2px] justify-center">
                        {weeks.map((_, i) => {
                            const label = months.find(
                                (m) => Math.floor(m.index / 7) === i
                            );
                            return (
                                <div
                                    key={i}
                                    className="w-[12px] text-[10px] text-muted-foreground"
                                >
                                    {label ? label.label : ""}
                                </div>
                            );
                        })}
                    </div>

                    <div className="overflow-x-auto">
                        <div className="flex gap-[3px] justify-center">
                            {weeks.map((week, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col gap-[3px]"
                                >
                                    {week.map((day, j) => {
                                        const count = day
                                            ? activityMap[day] || 0
                                            : 0;
                                        return day ? (
                                            <Tooltip key={day}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        onClick={() =>
                                                            onDayClick?.(
                                                                day,
                                                                count
                                                            )
                                                        }
                                                        className={`
                              w-[12px] h-[12px]
                              rounded-[2px]
                              border border-[#00000033]
                              transition-all
                              hover:scale-125
                              cursor-pointer
                              ${getColor(count)}
                            `}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-xs">
                                                        {count} route
                                                        {count !== 1
                                                            ? "s"
                                                            : ""}{" "}
                                                        on {day}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <div
                                                key={j}
                                                className="w-[12px] h-[12px] rounded-[2px] bg-[#2a2a2a]"
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs">
                        <span>Less</span>
                        <div className="flex gap-[3px]">
                            <div className="w-[12px] h-[12px] bg-[#2a2a2a] rounded-[2px]" />
                            <div className="w-[12px] h-[12px] bg-[#0d3f6d] rounded-[2px]" />
                            <div className="w-[12px] h-[12px] bg-[#0a5ca0] rounded-[2px]" />
                            <div className="w-[12px] h-[12px] bg-[#1e7ae6] rounded-[2px]" />
                            <div className="w-[12px] h-[12px] bg-[#4aa3ff] rounded-[2px]" />
                        </div>
                        <span>More</span>
                    </div>
                </div>
            </TooltipProvider>
        </div>
    );
};
