import React from "react";
import { Game } from "@/components/layouts/Gamemodes/List/listTypes";
import { Badge } from "@/components/ui/shadcn/badge";
import { useGameTags } from "@/hooks/gamemodes/useGameTags";

interface Props {
    game: Game;
}

export const GamemodeInfo: React.FC<Props> = ({ game }) => {
    const { ranking, tags } = useGameTags(game);

    return (
        <div className="flex items-center gap-5 pb-8">
            <img
                src={game.image}
                alt={game.title}
                className="h-24 w-24 shrink-0 rounded-lg object-cover"
            />

            <div className="min-w-0">
                <h1 className="break-words">{game.title}</h1>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                    {ranking && <Badge variant="success">{ranking}</Badge>}

                    {tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                    ))}
                </div>
                <p className="mt-2 text-sm">{game.description}</p>
            </div>
        </div>
    );
};
