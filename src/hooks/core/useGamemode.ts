import { useSearchParams } from "react-router-dom";
import { useGamemodes } from "@/hooks/gamemodes/useGamemodes";

// The backend owns the list of gamemodes and decides which of them already has
// a database behind it, so nothing here hardcodes what exists
export const useGamemode = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { gamemodes, loading } = useGamemodes();

    const fallback = gamemodes.find((mode) => mode.isDefault) ?? null;
    const requested = searchParams.get("gamemode");
    const current =
        gamemodes.find((mode) => mode.slug === requested) ?? fallback;

    const setGamemode = (slug: string) => {
        const params = new URLSearchParams(searchParams);

        if (slug === fallback?.slug) {
            params.delete("gamemode");
        } else {
            params.set("gamemode", slug);
        }

        setSearchParams(params);
    };

    return {
        gamemode: current,
        gamemodes,
        setGamemode,
        loading,
    };
};
