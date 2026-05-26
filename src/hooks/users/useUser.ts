import { useState, useEffect } from "react";
import { AccountUser } from "@/types/user";
import { usersApi } from "@/api/users";

export const useUser = (username: string | undefined) => {
    const [user, setUser] = useState<AccountUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) return;

        const controller = new AbortController();

        const fetch = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await usersApi.getUserByUsername(username);
                setUser(res.data);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
                setError(err instanceof Error ? err.message : "Unknown error");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetch();
        return () => controller.abort();
    }, [username]);

    return { user, loading, error };
};
