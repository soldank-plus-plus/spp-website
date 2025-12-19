import { useEffect, useState } from "react";
import { User } from "@/components/layouts/Ranking/Global/GlobalTable/usersData";

export const usePlayerSearch = (players: User[]) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const filteredPlayers = players.filter((player) =>
        player.username.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return {
        searchTerm,
        setSearchTerm,
        filteredPlayers,
    };
};
