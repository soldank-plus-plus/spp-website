import { useQuery } from "@tanstack/react-query";
import { Server } from "@/components/layouts/Servers/Fetching/serverTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Shared instance, so a render without data does not hand the server list a
// new array and restart the filtering the table feeds back into
const NO_SERVERS: Server[] = [];

// Player counts and maps go stale within a minute, so this is the one list on
// the site worth refreshing on a timer, though only while the tab is open
export const useServers = () => {
    const { data, isPending, error } = useQuery({
        queryKey: ["servers"],
        queryFn: async (): Promise<Server[]> => {
            const response = await fetch(`${API_BASE_URL}/servers`);

            if (!response.ok) {
                throw new Error("Failed to fetch servers");
            }

            return response.json();
        },
        staleTime: 60_000,
        refetchInterval: 60_000,
        refetchOnWindowFocus: true,
    });

    return {
        servers: data ?? NO_SERVERS,
        loading: isPending,
        error: error ? error.message : null,
    };
};
