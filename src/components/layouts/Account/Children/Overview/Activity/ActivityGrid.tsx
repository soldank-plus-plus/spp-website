import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import { getColor } from "./activityTypes";

interface Props {
    weeks: string[][];
    months: { index: number; label: string }[];
    activityMap: Record<string, number>;
    palette: string[];
    onDayClick?: (day: string, count: number) => void;
    loading?: boolean;
}

export const ActivityGrid: React.FC<Props> = ({ weeks, months, activityMap, palette, onDayClick, loading }) => (
    <>
        <div className="flex gap-[3px] pl-[2px] justify-center">
            {weeks.map((_, i) => {
                const label = months.find((m) => Math.floor(m.index / 7) === i);
                return (
                    <div key={i} className="w-[12px] text-[10px] text-muted-foreground">
                        {label ? label.label : ""}
                    </div>
                );
            })}
        </div>

        <div className="overflow-x-auto">
            <div className="flex gap-[3px] justify-center">
                {weeks.map((week, i) => (
                    <div key={i} className="flex flex-col gap-[3px]">
                        {week.map((day, j) => {
                            if (loading) return (
                                <div
                                    key={day || j}
                                    className="w-[12px] h-[12px] rounded-[2px] animate-pulse"
                                    style={{ backgroundColor: palette[0] }}
                                />
                            );
                            const count = day ? activityMap[day] || 0 : 0;
                            const color = getColor(count, palette);
                            return day ? (
                                <Tooltip key={day}>
                                    <TooltipTrigger asChild>
                                        <div
                                            onClick={() => onDayClick?.(day, count)}
                                            className="w-[12px] h-[12px] rounded-[2px] border border-[#00000033] transition-all hover:scale-125 cursor-pointer"
                                            style={{ backgroundColor: color }}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">
                                            {count} route{count !== 1 ? "s" : ""} on {day}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <div
                                    key={j}
                                    className="w-[12px] h-[12px] rounded-[2px]"
                                    style={{ backgroundColor: palette[0] }}
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
                {[...new Set(palette)].map((color, i) => (
                    <div
                        key={i}
                        className="w-[12px] h-[12px] rounded-[2px]"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
            <span>More</span>
        </div>
    </>
);
