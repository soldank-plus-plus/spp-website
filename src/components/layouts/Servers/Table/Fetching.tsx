import React, { useEffect, useState, useMemo } from "react";
import { Server as RawServerType } from "@/components/layouts/Servers/Table/serverTypes";
import ServersTable from "@/components/layouts/Servers/Table/ServerTable";
import {
    Filtering,
    Server as FilteredServerType,
} from "@/components/layouts/Servers/Table/Filtering";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Fetching: React.FC = () => {
    const [rawServers, setRawServers] = useState<RawServerType[]>([]);
    const [filteredSortedServers, setFilteredSortedServers] = useState<
        FilteredServerType[]
    >([]);
    const [totalPlayers, setTotalPlayers] = useState(0);

    useEffect(() => {
        fetch(`${API_BASE_URL}/servers`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data: RawServerType[]) => {
                setRawServers(data);
            })
            .catch((error) => {
                console.error("Fetching servers error:", error);
            });
    }, []);

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
