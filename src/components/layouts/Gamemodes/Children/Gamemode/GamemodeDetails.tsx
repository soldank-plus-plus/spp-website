import React from "react";
import { Game } from "@/components/layouts/Gamemodes/List/listTypes";

interface Props {
    game: Game;
}

export const GamemodeDetails: React.FC<Props> = ({ game }) => {
    return (
        <div className="mt-12">
            <section>
                <h3 className="mb-3">Description</h3>

                {game.about ? (
                    <div className="space-y-3">
                        {game.about.map((paragraph) => (
                            <p key={paragraph} className="text-sm">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm">Description coming soon.</p>
                )}
            </section>
        </div>
    );
};
