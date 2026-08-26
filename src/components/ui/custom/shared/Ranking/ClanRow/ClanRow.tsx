import React from "react";
import { TableRow, TableCell } from "@/components/ui/shadcn/table";
import { Clan } from "@/types/clan";
import { ClanSortKey } from "@/api/clans";

interface Props {
    clan: Clan;
    index: number;
    currentPage: number;
    pageSize: number;
    sortBy: ClanSortKey;
}

export const ClanRow: React.FC<Props> = ({
    clan,
    index,
    currentPage,
    pageSize,
    sortBy,
}) => {
    return (
        <TableRow
            className={`${
                index % 2 === 0 ? "bg-rowdark" : "bg-rowlight"
            } hover:bg-accenthover transition-colors duration-200`}
        >
            <TableCell className="text-center px-0.5 py-2 font-bold text-secondary">
                {(currentPage - 1) * pageSize + index + 1}
            </TableCell>

            <TableCell className="px-0.5 py-2 text-secondary">
                <span className="font-medium truncate text-secondary">
                    {clan.clanname}
                </span>
            </TableCell>

            <TableCell className="text-center px-0.5 py-2 text-secondary">
                {clan.users_count}
            </TableCell>

            <TableCell
                className={`text-center px-0.5 py-2 ${
                    sortBy === "unique_caps"
                        ? "text-foreground"
                        : "text-secondary"
                }`}
            >
                {clan.unique_caps}
            </TableCell>

            <TableCell
                className={`text-center px-0.5 py-2 ${
                    sortBy === "hardest" ? "text-foreground" : "text-secondary"
                }`}
            >
                {clan.hardest}
            </TableCell>

            <TableCell
                className={`text-center px-0.5 py-2 ${
                    sortBy === "gold" ? "text-foreground" : "text-secondary"
                }`}
            >
                {clan.gold}
            </TableCell>

            <TableCell className="text-center px-0.5 py-2 text-secondary">
                {clan.silver}
            </TableCell>

            <TableCell className="text-center px-0.5 py-2 text-secondary">
                {clan.bronze}
            </TableCell>
        </TableRow>
    );
};
