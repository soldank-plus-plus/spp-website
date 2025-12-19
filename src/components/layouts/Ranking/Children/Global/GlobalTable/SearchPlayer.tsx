import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    onSearch?: () => void;
}

export const SearchPlayer: React.FC<Props> = ({
    searchTerm,
    setSearchTerm,
    onSearch,
}) => {
    return (
        <div className="relative min-w-[160px] max-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <Input
                type="text"
                placeholder="Search player..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    onSearch?.();
                }}
                className="pl-10 w-full"
            />
        </div>
    );
};
