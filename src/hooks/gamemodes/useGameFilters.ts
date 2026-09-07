import { useSearchParams } from "react-router-dom";
import {
    Game,
    GamePlayers,
    GameStyle,
    games,
} from "@/components/layouts/Gamemodes/List/listTypes";
import { useGamemodes } from "@/hooks/gamemodes/useGamemodes";

export const GAME_STYLES: { key: GameStyle; label: string }[] = [
    { key: "custom", label: "custom" },
    { key: "movement", label: "movement" },
    { key: "objective", label: "objective" },
    { key: "aim", label: "aim" },
    { key: "shooting", label: "shooting" },
];

export type GameFeature = "global-ranking" | GamePlayers;

// Ordered so the two column grid keeps singleplayer above multiplayer
export const GAME_FEATURES: { key: GameFeature; label: string }[] = [
    { key: "singleplayer", label: "singleplayer" },
    { key: "global-ranking", label: "global ranking" },
    { key: "multiplayer", label: "multiplayer" },
];

const isStyle = (value: string): value is GameStyle =>
    GAME_STYLES.some((style) => style.key === value);

const isFeature = (value: string): value is GameFeature =>
    GAME_FEATURES.some((feature) => feature.key === value);

// Options inside one group widen the list, groups narrow it down
export const useGameFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { gamemodes } = useGamemodes();

    const styles = (searchParams.get("styles") ?? "")
        .split(",")
        .filter(isStyle);
    const features = (searchParams.get("features") ?? "")
        .split(",")
        .filter(isFeature);

    const setValues = (key: string, values: string[]) => {
        const params = new URLSearchParams(searchParams);

        if (values.length === 0) {
            params.delete(key);
        } else {
            params.set(key, values.join(","));
        }

        setSearchParams(params);
    };

    const toggle = <T extends string>(key: string, current: T[], value: T) =>
        setValues(
            key,
            current.includes(value)
                ? current.filter((entry) => entry !== value)
                : [...current, value]
        );

    const matchesStyles = (game: Game) =>
        styles.length === 0 ||
        game.styles.some((style) => styles.includes(style));

    const matchesFeatures = (game: Game) =>
        features.length === 0 ||
        features.some((feature) =>
            feature === "global-ranking"
                ? gamemodes.some((mode) => mode.slug === game.slug)
                : game.players === feature
        );

    return {
        // A card without a page of its own is a call to action rather than a
        // mode, so it stays in the grid whatever is filtered
        games: games.filter(
            (game) =>
                !game.slug || (matchesStyles(game) && matchesFeatures(game))
        ),
        styles,
        features,
        selected: styles.length + features.length,
        toggleStyle: (style: GameStyle) => toggle("styles", styles, style),
        toggleFeature: (feature: GameFeature) =>
            toggle("features", features, feature),
    };
};
