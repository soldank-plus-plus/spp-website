import React, { useEffect, useState, useMemo } from "react";
import { Server as RawServerType } from "@/components/layouts/Servers/Table/serverTypes";
import ServersTable from "@/components/layouts/Servers/Table/ServerTable";
import {
    Filtering,
    Server as FilteredServerType,
} from "@/components/layouts/Servers/Table/Filtering";

const Fetching: React.FC = () => {
    const [rawServers, setRawServers] = useState<RawServerType[]>([]);
    const [filteredSortedServers, setFilteredSortedServers] = useState<
        FilteredServerType[]
    >([]);
    const [totalPlayers, setTotalPlayers] = useState(0);

    // Fetching servers once on mount
    useEffect(() => {
        fetch("/api/servers")
            .then((res) => res.json())
            .then((data: RawServerType[]) => {
                setRawServers(data);
            })
            .catch(console.error);
    }, []);

    // Transform rawServers into the format Filtering expects
    const transformedData: FilteredServerType[] = useMemo(() => {
        return rawServers.map((s) => ({
            gamemode: s.game_style,
            players: `${s.players.length}/${s.max_players}`,
            map: s.current_map,
            server: s.name,
            latency: "—", // Real latency is not available for now
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
