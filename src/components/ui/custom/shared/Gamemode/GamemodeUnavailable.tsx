import React from "react";
import { useGamemode } from "@/hooks/gamemodes/useGamemode";

export const GamemodeUnavailable: React.FC = () => {
    const { gamemode } = useGamemode();

    return (
        <p className="py-24 text-center text-secondary">
            {gamemode?.name} is coming soon.
        </p>
    );
};
