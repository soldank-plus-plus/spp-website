import React, { useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/shadcn/pagination";
import { Input } from "@/components/ui/shadcn/input";

interface PageJumpProps {
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PageJump: React.FC<PageJumpProps> = ({ totalPages, onPageChange }) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState("");

    const commit = () => {
        const parsed = Number(value);

        setEditing(false);
        setValue("");

        if (!Number.isInteger(parsed) || parsed < 1) return;
        onPageChange(Math.min(parsed, totalPages));
    };

    if (!editing)
        return (
            <button
                type="button"
                aria-label="Go to a specific page"
                onClick={() => setEditing(true)}
            >
                <PaginationEllipsis />
            </button>
        );

    return (
        <Input
            autoFocus
            type="text"
            inputMode="numeric"
            aria-label={`Page number, 1 to ${totalPages}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            // a bare input does not submit on Enter, so the key is handled here
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    commit();
                }
                if (e.key === "Escape") {
                    setValue("");
                    setEditing(false);
                }
            }}
            onBlur={commit}
            className="h-9 w-16 px-1 text-center"
        />
    );
};

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const CustomPagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const getPages = () => {
        const pages: number[] = [];

        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pages = getPages();

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                    />
                </PaginationItem>

                {currentPage > 3 && (
                    <>
                        <PaginationItem>
                            <PaginationLink onClick={() => onPageChange(1)}>
                                1
                            </PaginationLink>
                        </PaginationItem>
                        <PageJump
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    </>
                )}

                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                                e.preventDefault();
                                onPageChange(page);
                            }}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {currentPage < totalPages - 2 && (
                    <>
                        <PageJump
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                        <PaginationItem>
                            <PaginationLink
                                onClick={() => onPageChange(totalPages)}
                            >
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                                onPageChange(currentPage + 1);
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};
