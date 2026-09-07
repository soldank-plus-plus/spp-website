import React from "react";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";

interface Props {
    years: number[];
    year: number;
    onYearChange: (year: number) => void;
}

export const ActivityYears: React.FC<Props> = ({
    years,
    year,
    onYearChange,
}) => (
    <ScrollArea className="h-[133px] shrink-0 [&>[data-orientation=vertical]]:w-1">
        <div className="flex flex-col gap-2 pr-3">
            {years.map((entry) => (
                <button
                    key={entry}
                    onClick={() => onYearChange(entry)}
                    aria-pressed={year === entry}
                    className={`rounded px-2 py-1 text-sm transition-colors ${
                        year === entry
                            ? "bg-gray-800 text-heading font-semibold"
                            : "text-secondary hover:text-heading"
                    }`}
                >
                    {entry}
                </button>
            ))}
        </div>
    </ScrollArea>
);
