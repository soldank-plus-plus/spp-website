import React from "react";
import { ActivityFilter, FILTERS } from "./activityTypes";

interface Props {
    filter: ActivityFilter;
    onFilterChange: (f: ActivityFilter) => void;
}

export const ActivityFilters: React.FC<Props> = ({ filter, onFilterChange }) => (
    <div className="flex gap-2">
        {FILTERS.map(({ key, label }) => (
            <button
                key={key}
                onClick={() => onFilterChange(key)}
                className={`rounded px-3 py-1 text-sm font-semibold whitespace-nowrap ${
                    filter === key ? "bg-accent text-white" : "bg-sombre text-secondary"
                }`}
            >
                {label} {filter === key ? "▼" : ""}
            </button>
        ))}
    </div>
);
