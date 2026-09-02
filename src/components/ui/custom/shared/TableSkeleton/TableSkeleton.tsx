import React from "react";
import { TableRow, TableCell } from "@/components/ui/shadcn/table";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

interface Props {
    rows: number;
    columns: number;
}

export const TableSkeleton: React.FC<Props> = ({ rows, columns }) => (
    <>
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-rowdark" : "bg-rowlight"}
            >
                {Array.from({ length: columns }).map((_, columnIndex) => (
                    <TableCell key={columnIndex} className="px-0.5 py-2">
                        <Skeleton className="h-4 w-full" />
                    </TableCell>
                ))}
            </TableRow>
        ))}
    </>
);
