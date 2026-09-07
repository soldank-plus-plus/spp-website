import React from "react";
import { GamemodePicker } from "@/components/ui/custom/shared/Gamemode/GamemodePicker";

export const RankingHeader: React.FC = () => {
    return (
        <>
            <h1 className="mt-60 mb-6 text-center text-foreground">Ranking</h1>

            <div className="max-w-5xl mx-auto mb-4 px-6">
                <GamemodePicker />
            </div>
        </>
    );
};
