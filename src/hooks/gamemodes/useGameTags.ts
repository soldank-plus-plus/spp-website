import { Game } from "@/components/layouts/Gamemodes/List/listTypes";
import { GAME_FEATURES } from "@/hooks/gamemodes/useGameFilters";
import { useGamemodes } from "@/hooks/gamemodes/useGamemodes";

// The tags the gamemode list filters by, resolved for a single mode. A ranking
// is the one worth highlighting, so it is kept apart from the plain tags
export const useGameTags = (game: Game) => {
    const { gamemodes } = useGamemodes();

    const ranked = gamemodes.some((mode) => mode.slug === game.slug);
    const ranking =
        GAME_FEATURES.find((feature) => feature.key === "global-ranking")
            ?.label ?? "global ranking";

    return {
        ranking: ranked ? ranking : null,
        tags: [...game.styles, ...(game.players ? [game.players] : [])],
    };
};
