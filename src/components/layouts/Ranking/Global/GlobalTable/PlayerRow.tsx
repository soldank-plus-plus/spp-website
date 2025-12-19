import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import ReactCountryFlag from "react-country-flag";
import { useNavigate } from "react-router-dom";
import { User } from "./usersData";

interface Props {
    player: User;
    index: number;
    currentPage: number;
    pageSize: number;
    sortBy: "records" | "hardest" | "gold";
}

export const PlayerRow: React.FC<Props> = ({
    player,
    index,
    currentPage,
    pageSize,
    sortBy,
}) => {
    const navigate = useNavigate();

    return (
        <TableRow
            key={player.rank}
            className={`${
                index % 2 === 0 ? "bg-rowdark" : "bg-rowlight"
            } hover:bg-accenthover transition-colors duration-200`}
        >
            <TableCell className="text-center px-0.5 py-2 font-bold text-secondary">
                {(currentPage - 1) * pageSize + index + 1}
            </TableCell>

            <TableCell className="px-0.5 py-2 text-secondary">
                <div className="flex items-center gap-1">
                    <img
                        src={player.avatar}
                        alt="avatar"
                        className="w-5 h-5 rounded-full border"
                    />
                    <ReactCountryFlag
                        countryCode={player.country}
                        svg
                        style={{ width: "1em", height: "1em" }}
                    />
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
                    sortBy === "records" ? "text-foreground" : "text-secondary"
                }`}
            >
                {player.records}
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
