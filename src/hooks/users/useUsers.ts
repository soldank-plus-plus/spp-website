import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { usersApi, GetUsersParams } from "@/api/users";
import { useDebounce } from "@/hooks/core/useDebounce";

export type SortKey = "records" | "hardest" | "gold";

interface UseUsersProps {
    page: number;
    pageSize: number;
    search?: string;
    sort?: SortKey;
}

export const useUsers = ({
    page,
    pageSize,
    search = "",
    sort = "records",
}: UseUsersProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                // Używamy nowego API - zwraca więcej meta danych
                const res = await usersApi.getUsers({
                    page,
                    pageSize,
                    search: debouncedSearch,
                    sort,
                });

                setUsers(res.data || []);
                setTotalPages(res.meta.totalPages);
            } catch (err) {
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
    }, [page, pageSize, debouncedSearch, sort]);

    return { users, totalPages, loading, error };
};
