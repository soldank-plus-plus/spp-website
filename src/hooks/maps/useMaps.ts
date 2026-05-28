import { useState, useEffect } from "react";
import { Map } from "@/types/map";
import { mapsApi } from "@/api/maps";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UseMapsProps {
    page: number;
    pageSize: number;
    search?: string;
}

export const useMaps = ({ page, pageSize, search = "" }: UseMapsProps) => {
    const [maps, setMaps] = useState<Map[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const controller = new AbortController();

        const fetchMaps = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await mapsApi.getMaps(
                    { page, pageSize, search: debouncedSearch },
                    controller.signal
                );
                setMaps(res.data || []);
                setTotalPages(res.meta.totalPages);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
                const message = err instanceof Error ? err.message : "Unknown error occurred";
                setError(message);
                setMaps([]);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        fetchMaps();
        return () => controller.abort();
    }, [page, pageSize, debouncedSearch]);

    return { maps, totalPages, loading, error };
};
