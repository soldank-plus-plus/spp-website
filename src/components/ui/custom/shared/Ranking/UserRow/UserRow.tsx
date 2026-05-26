import React from "react";
import { TableRow, TableCell } from "@/components/ui/shadcn/table";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/user";
import { SortKey } from "@/api/users";

interface Props {
    player: User;
    index: number;
    currentPage: number;
    pageSize: number;
    sortBy: SortKey;
}

export const UserRow: React.FC<Props> = ({
    player,
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
                <div className="flex items-center gap-1">
                    <span
                        className="font-medium truncate text-secondary cursor-pointer hover:text-foreground hover:underline"
                        onClick={() => navigate(`/account/${player.username}`)}
                    >
                        {player.username}
                    </span>
                </div>
            </TableCell>

            <TableCell className="text-center px-0.5 py-2 text-secondary">
                {player.passed}%
            </TableCell>

            <TableCell
                className={`text-center px-0.5 py-2 ${
                    sortBy === "unique_caps" ? "text-foreground" : "text-secondary"
                }`}
            >
                {player.unique_caps}
            </TableCell>

            <TableCell
                className={`text-center px-0.5 py-2 ${
                    sortBy === "hardest" ? "text-foreground" : "text-secondary"
                }`}
            >
                {player.hardest}
            </TableCell>

            <TableCell
                className={`text-center px-0.5 py-2 ${
                    sortBy === "gold" ? "text-foreground" : "text-secondary"
                }`}
            >
                {player.gold}
            </TableCell>

            <TableCell className="text-center px-0.5 py-2 text-secondary">
                {player.silver}
            </TableCell>

            <TableCell className="text-center px-0.5 py-2 text-secondary">
                {player.bronze}
            </TableCell>
        </TableRow>
    );
};