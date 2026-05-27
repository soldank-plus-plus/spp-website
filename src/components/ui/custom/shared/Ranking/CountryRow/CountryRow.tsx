import React from "react";
import { TableRow, TableCell } from "@/components/ui/shadcn/table";
import { Country } from "@/types/country";
import { CountrySortKey } from "@/api/countries";
import { getFlagByName } from "@/utils/countryFlags";

interface Props {
    country: Country;
    index: number;
    currentPage: number;
    pageSize: number;
    sortBy: CountrySortKey;
    onSelect: (country: Country) => void;
}

export const CountryRow: React.FC<Props> = ({
    country,
    index,
    currentPage,
    pageSize,
    sortBy,
    onSelect,
}) => {
    return (
        <TableRow
            className={`${
                index % 2 === 0 ? "bg-rowdark" : "bg-rowlight"
            } hover:bg-accenthover transition-colors duration-200 cursor-pointer`}
            onClick={() => onSelect(country)}
        >
            <TableCell className="text-center px-0.5 py-2 font-bold text-secondary">
                {(currentPage - 1) * pageSize + index + 1}
            </TableCell>

            <TableCell className="px-0.5 py-2 text-secondary">
                <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none" aria-hidden="true">
                        {getFlagByName(country.countryname)}
                    </span>
                    <span className="font-medium truncate text-secondary hover:text-foreground hover:underline">
                        {country.countryname}
                    </span>
                </div>
            </TableCell>

            <TableCell className="text-center px-0.5 py-2 text-secondary">
                {country.users_count}
            </TableCell>

            <TableCell
                className={`text-center px-0.5 py-2 ${
                    sortBy === "unique_caps" ? "text-foreground" : "text-secondary"
                }`}
            >
                {country.unique_caps}
            </TableCell>

            <TableCell
                className={`text-center px-0.5 py-2 ${
                    sortBy === "hardest" ? "text-foreground" : "text-secondary"
                }`}
            >
                {country.hardest}
            </TableCell>

            <TableCell
                className={`text-center px-0.5 py-2 ${
                    sortBy === "gold" ? "text-foreground" : "text-secondary"
                }`}
            >
                {country.gold}
            </TableCell>

            <TableCell className="text-center px-0.5 py-2 text-secondary">
                {country.silver}
            </TableCell>

            <TableCell className="text-center px-0.5 py-2 text-secondary">
                {country.bronze}
            </TableCell>
        </TableRow>
    );
};
