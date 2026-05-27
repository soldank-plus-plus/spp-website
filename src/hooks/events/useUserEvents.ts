import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { eventsApi } from "@/api/events";
import { useDebounce } from "@/hooks/core/useDebounce";

interface UseUserEventsProps {
    userId: number;
    page: number;
    pageSize: number;
    search?: string;
}

export const useUserEvents = ({ userId, page, pageSize, search = "" }: UseUserEventsProps) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const controller = new AbortController();

        const fetchEvents = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await eventsApi.getUserEvents(userId, {
                    page,
                    pageSize,
                    search: debouncedSearch,
                    signal: controller.signal,
                });

                setEvents(res.data || []);
                setTotalPages(res.meta?.totalPages ?? 1);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
                const message = err instanceof Error ? err.message : "Unknown error occurred";
                setError(message);
                setEvents([]);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
        return () => controller.abort();
    }, [userId, page, pageSize, debouncedSearch]);

    return { events, totalPages, loading, error };
};
