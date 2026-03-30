import { useMemo, useState } from "react";
import { User } from "@/components/layouts/Ranking/Children/Global/usersData";

export type SortKey = "records" | "hardest" | "gold";

export const useSortPlayers = (players: User[]) => {
    const [sortBy, setSortBy] = useState<SortKey>("records");

    const sortedPlayers = useMemo(() => {
        return [...players].sort((a, b) => b[sortBy] - a[sortBy]);
    }, [players, sortBy]);

    return {
        sortBy,
        setSortBy,
        sortedPlayers,
    };
};
