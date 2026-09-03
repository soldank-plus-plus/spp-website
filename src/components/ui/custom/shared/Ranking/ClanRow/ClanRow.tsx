import React from "react";
import { useNavigate } from "react-router-dom";
import { TableRow, TableCell } from "@/components/ui/shadcn/table";
import { Clan } from "@/types/clan";
import { ClanSortKey } from "@/hooks/clans/useClans";

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
    const navigate = useNavigate();

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
                <div className="flex min-w-0 items-baseline gap-1.5">
                    <span
                        className="font-medium truncate cursor-pointer hover:text-foreground hover:underline"
                        onClick={() =>
                            navigate(
                                `/clans/${clan.id}?name=${encodeURIComponent(clan.clanname)}`
                            )
                        }
                    >
                        {clan.clanname}
                    </span>
                    {clan.tag && (
                        <span className="shrink-0 text-xs text-secondary">
                            {clan.tag}
                        </span>
                    )}
                </div>
            </TableCell>

            <TableCell className="text-center px-0.5 py-2 text-secondary">
                {clan.usersCount}
            </TableCell>

            <TableCell
                className={`text-center px-0.5 py-2 ${
                    sortBy === "unique_caps"
                        ? "text-foreground"
                        : "text-secondary"
                }`}
            >
                {clan.uniqueCaps}
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
