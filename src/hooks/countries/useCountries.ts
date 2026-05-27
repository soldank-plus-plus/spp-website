import { useState, useEffect } from "react";
import { Country } from "@/types/country";
import { countriesApi, CountrySortKey } from "@/api/countries";
import { useDebounce } from "@/hooks/core/useDebounce";

export type { CountrySortKey };

interface UseCountriesProps {
    page: number;
    pageSize: number;
    search?: string;
    sort?: CountrySortKey;
}

export const useCountries = ({
    page,
    pageSize,
    search = "",
    sort = "unique_caps",
}: UseCountriesProps) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const controller = new AbortController();

        const fetchCountries = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await countriesApi.getCountries({
                    page,
                    pageSize,
                    search: debouncedSearch,
                    sort,
                    signal: controller.signal,
                });

                setCountries(res.data || []);
                setTotalPages(res.meta.totalPages);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
                const message =
                    err instanceof Error ? err.message : "Unknown error occurred";
                setError(message);
                setCountries([]);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
        return () => controller.abort();
    }, [page, pageSize, debouncedSearch, sort]);

    return { countries, totalPages, loading, error };
};
