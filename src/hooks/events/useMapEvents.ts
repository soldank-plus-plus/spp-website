import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { eventsApi } from "@/api/events";

interface UseMapEventsProps {
    mapId: number;
    page: number;
    pageSize: number;
}

export const useMapEvents = ({ mapId, page, pageSize }: UseMapEventsProps) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchEvents = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await eventsApi.getMapEvents(mapId, {
                    page,
                    pageSize,
                    signal: controller.signal,
                });

                setEvents(res.data || []);
                setTotalPages(res.meta?.totalPages ?? 1);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
                const message =
                    err instanceof Error
                        ? err.message
                        : "Unknown error occurred";
                setError(message);
                setEvents([]);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
        return () => controller.abort();
    }, [mapId, page, pageSize]);

    return { events, totalPages, loading, error };
};
