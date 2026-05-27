import { useState, useEffect } from "react";
import { Clan } from "@/types/clan";
import { clansApi, ClanSortKey } from "@/api/clans";
import { useDebounce } from "@/hooks/core/useDebounce";

export type { ClanSortKey };

interface UseClansProps {
    page: number;
    pageSize: number;
    search?: string;
    sort?: ClanSortKey;
}

export const useClans = ({
    page,
    pageSize,
    search = "",
    sort = "unique_caps",
}: UseClansProps) => {
    const [clans, setClans] = useState<Clan[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const controller = new AbortController();

        const fetchClans = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await clansApi.getClans({
                    page,
                    pageSize,
                    search: debouncedSearch,
                    sort,
                    signal: controller.signal,
                });

                setClans(res.data || []);
                setTotalPages(res.meta.totalPages);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
                const message =
                    err instanceof Error ? err.message : "Unknown error occurred";
                setError(message);
                setClans([]);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        fetchClans();
        return () => controller.abort();
    }, [page, pageSize, debouncedSearch, sort]);

    return { clans, totalPages, loading, error };
};
