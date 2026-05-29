import React from "react";

type SortButtonKey = "unique_caps" | "hardest" | "gold";

interface Props {
    sortBy: string;
    onSortChange: (key: SortButtonKey) => void;
}

export const SortButtons: React.FC<Props> = ({ sortBy, onSortChange }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {(["unique_caps", "hardest", "gold"] as const).map((key) => (
                <button
                    key={key}
                    onClick={() => onSortChange(key)}
                    className={`rounded px-3 py-1 text-sm font-semibold whitespace-nowrap ${
                        sortBy === key
                            ? "bg-accent text-white"
                            : "bg-sombre text-secondary"
                    }`}
                >
                    {key === "unique_caps"
                        ? "Records"
                        : key === "hardest"
                          ? "Hardest"
                          : "Golds"}{" "}
                    {sortBy === key ? "▼" : ""}
                </button>
            ))}
        </div>
    );
};
