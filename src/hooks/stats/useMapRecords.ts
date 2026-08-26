import { useState, useEffect } from "react";
import { Stat } from "@/types/stat";
import { statsApi } from "@/api/stats";

interface UseMapRecordsProps {
    mapId: number;
    page: number;
    pageSize: number;
}

export const useMapRecords = ({
    mapId,
    page,
    pageSize,
}: UseMapRecordsProps) => {
    const [records, setRecords] = useState<Stat[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchRecords = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await statsApi.getMapStats(mapId, {
                    page,
                    pageSize,
                    signal: controller.signal,
                });

                setRecords(res.data || []);
                setTotalPages(res.meta?.totalPages ?? 1);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
                const message =
                    err instanceof Error
                        ? err.message
                        : "Unknown error occurred";
                setError(message);
                setRecords([]);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
        return () => controller.abort();
    }, [mapId, page, pageSize]);

    return { records, totalPages, loading, error };
};
