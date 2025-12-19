import { useState, useMemo } from "react";

export const usePagination = <T>(items: T[], pageSize: number) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(
        () => Math.ceil(items.length / pageSize),
        [items, pageSize]
    );

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = currentPage * pageSize;
        return items.slice(start, end);
    }, [currentPage, items, pageSize]);

    return {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems,
    };
};
