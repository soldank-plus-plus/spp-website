import React from "react";
import { useGamemode } from "@/hooks/core/useGamemode";

export const GamemodeUnavailable: React.FC = () => {
    const { gamemode } = useGamemode();

    return (
        <p className="py-24 text-center text-secondary">
            {gamemode?.name} is coming soon.
        </p>
    );
};
