import React from "react";
import { Input } from "@/components/ui/shadcn/input";
import { Search } from "lucide-react";

interface Props {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    placeholder?: string;
}

export const SearchUser: React.FC<Props> = ({
    searchTerm,
    setSearchTerm,
    placeholder = "Search player...",
}) => {
    return (
        <div className="relative min-w-[160px] max-w-[200px] my-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
            />
        </div>
    );
};
