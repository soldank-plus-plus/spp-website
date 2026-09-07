import React, { useState, useMemo } from "react";
import ServersTable from "@/components/layouts/Servers/Fetching/ServerTable";
import {
    Filtering,
    Server as FilteredServerType,
} from "@/components/layouts/Servers/Fetching/Filtering";
import { useServers } from "@/hooks/servers/useServers";

const Fetching: React.FC = () => {
    const { servers: rawServers } = useServers();
    const [filteredSortedServers, setFilteredSortedServers] = useState<
        FilteredServerType[]
    >([]);
    const [totalPlayers, setTotalPlayers] = useState(0);

    const transformedData: FilteredServerType[] = useMemo(() => {
        return rawServers.map((s) => ({
            gamemode: s.game_style,
            players: `${s.players.length}/${s.max_players}`,
            map: s.current_map,
            server: s.name,
            latency: "—",
        }));
    }, [rawServers]);

    return (
        <>
            <h1 className="mb-10 pt-60 text-center">Servers</h1>
            <Filtering
                data={transformedData}
                onChange={setFilteredSortedServers}
                onStatsChange={({ totalPlayers }) =>
                    setTotalPlayers(totalPlayers)
                }
            />
            <ServersTable
                servers={rawServers}
                filteredSortedServers={filteredSortedServers}
                totalPlayers={totalPlayers}
            />
        </>
    );
};

export default Fetching;
