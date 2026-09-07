import React from "react";
import { GameCard } from "@/components/layouts/Gamemodes/List/GameCard";
import { motion } from "framer-motion";
import { GamemodeFilters } from "@/components/layouts/Gamemodes/List/GamemodeFilters";
import { useGameFilters } from "@/hooks/gamemodes/useGameFilters";

export const List: React.FC = () => {
    const { games } = useGameFilters();

    return (
        <div className="pt-60">
            <h1 className="mb-6 text-center">Gamemodes</h1>

            <p className="mx-auto max-w-3xl text-center">
                Alternatively, take a break from climbing the maps to exciting
                multiplayer experiences. Whether it&apos;s a tense game of chase
                & run, a fast-paced shooting match, prop hunt, or surviving
                waves of zombies!
            </p>

            <div className="flex justify-center items-start min-h-screen px-4 mt-6 mb-20">
                <div>
                    <div className="mb-6">
                        <GamemodeFilters />
                    </div>

                    {games.length === 0 ? (
                        <p className="text-secondary">
                            No gamemode matches the selected filters.
                        </p>
                    ) : (
                        <motion.div
                            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            {games.map((game) => (
                                <GameCard key={game.title} {...game} />
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
