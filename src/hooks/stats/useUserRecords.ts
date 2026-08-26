import { useState, useEffect } from "react";
import { Stat } from "@/types/stat";
import { statsApi } from "@/api/stats";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UseUserRecordsProps {
    userId: number;
    page: number;
    pageSize: number;
    search?: string;
}

export const useUserRecords = ({
    userId,
    page,
    pageSize,
    search = "",
}: UseUserRecordsProps) => {
    const [records, setRecords] = useState<Stat[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const controller = new AbortController();

        const fetchRecords = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await statsApi.getUserStats(userId, {
                    page,
                    pageSize,
                    search: debouncedSearch,
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
    }, [userId, page, pageSize, debouncedSearch]);

    return { records, totalPages, loading, error };
};
