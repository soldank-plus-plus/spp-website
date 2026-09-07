import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shadcn/select";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useGamemode } from "@/hooks/gamemodes/useGamemode";

export const GamemodePicker: React.FC = () => {
    const { gamemode, gamemodes, setGamemode, loading } = useGamemode();

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-secondary">Pick gamemode:</span>

            {loading || !gamemode ? (
                <Skeleton className="h-9 w-[175px] rounded-[10px]" />
            ) : (
                <Select value={gamemode.slug} onValueChange={setGamemode}>
                    <SelectTrigger className="h-9 w-[175px] rounded-[10px] border-white/20 bg-transparent px-2.5 py-1 focus:ring-0 focus:ring-offset-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-[10px] border-white/20 bg-nocturne">
                        {gamemodes.map((mode) => (
                            <SelectItem
                                key={mode.slug}
                                value={mode.slug}
                                className="rounded-[6px]"
                            >
                                {mode.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    );
};
