import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { usersApi } from "@/api/users";

export const useMapCreators = (pageSize = 20) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetch = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await usersApi.getUsers({
                    page: 1,
                    pageSize,
                    sort: "maps_created",
                    signal: controller.signal,
                });
                setUsers(res.data || []);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
                const message = err instanceof Error ? err.message : "Unknown error occurred";
                setError(message);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetch();
        return () => controller.abort();
    }, [pageSize]);

    return { users, loading, error };
};
