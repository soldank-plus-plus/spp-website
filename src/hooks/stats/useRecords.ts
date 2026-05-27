import { useState, useEffect } from "react";
import { Stat } from "@/types/stat";
import { statsApi } from "@/api/stats";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UseRecordsProps {
    page: number;
    pageSize: number;
    search?: string;
}

export const useRecords = ({ page, pageSize, search = "" }: UseRecordsProps) => {
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
                const res = await statsApi.getRecentStats({
                    page,
                    pageSize,
                    search: debouncedSearch,
                    signal: controller.signal,
                });

                setRecords(res.data || []);
                setTotalPages(res.meta?.totalPages ?? 1);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
                const message = err instanceof Error ? err.message : "Unknown error occurred";
                setError(message);
                setRecords([]);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
        return () => controller.abort();
    }, [page, pageSize, debouncedSearch]);

    return { records, totalPages, loading, error };
};
