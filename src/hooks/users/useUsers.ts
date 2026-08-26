import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { usersApi, SortKey } from "@/api/users";
import { useDebounce } from "@/hooks/core/useDebounce";

export type { SortKey };

interface UseUsersProps {
    page: number;
    pageSize: number;
    search?: string;
    sort?: SortKey;
    countryId?: number;
}

export const useUsers = ({
    page,
    pageSize,
    search = "",
    sort = "unique_caps",
    countryId,
}: UseUsersProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const controller = new AbortController();

        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await usersApi.getUsers({
                    page,
                    pageSize,
                    search: debouncedSearch,
                    sort,
                    countryId,
                    signal: controller.signal,
                });

                setUsers(res.data || []);
                setTotalPages(res.meta.totalPages);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
                const message =
                    err instanceof Error
                        ? err.message
                        : "Unknown error occurred";
                setError(message);
                setUsers([]);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
        return () => controller.abort();
    }, [page, pageSize, debouncedSearch, sort, countryId]);

    return { users, totalPages, loading, error };
};
