import React from "react";
import { Game } from "@/components/layouts/Gamemodes/List/listTypes";

interface Props {
    game: Game;
}

export const GamemodeInfo: React.FC<Props> = ({ game }) => {
    return (
        <div className="flex items-center gap-5 pb-8">
            <img
                src={game.image}
                alt={game.title}
                className="h-24 w-24 shrink-0 rounded-lg object-cover"
            />

            <div className="min-w-0">
                <h1 className="break-words">{game.title}</h1>
                <p className="mt-2 text-sm">{game.description}</p>
            </div>
        </div>
    );
};
