import { SortKey } from "@/components/layouts/Ranking/Children/Global/GlobalTable/hooks/useSortPlayers";

interface Props {
    sortBy: SortKey;
    onSortChange: (key: SortKey) => void;
}

export const SortButtons: React.FC<Props> = ({ sortBy, onSortChange }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {(["records", "hardest", "gold"] as const).map((key) => (
                <button
                    key={key}
                    onClick={() => onSortChange(key)}
                    className={`rounded px-3 py-1 text-sm font-semibold whitespace-nowrap ${
                        sortBy === key
                            ? "bg-accent text-white"
                            : "bg-sombre text-secondary"
                    }`}
                >
                    {key === "records"
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
