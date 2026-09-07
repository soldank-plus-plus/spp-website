import { Header } from "@/components/ui/custom/core/Header";
import { Leaderboard } from "@/components/layouts/Maps/Leaderboard";
import { Guidelines } from "@/components/layouts/Maps/Guidelines";
import { Maplist } from "@/components/layouts/Maps/Maplist/Maplist";
import { Footer } from "@/components/ui/custom/core/Footer";
import { GamemodePicker } from "@/components/ui/custom/shared/Gamemode/GamemodePicker";
import { MapFilters } from "@/components/layouts/Maps/Maplist/MapFilters";
import { GamemodeUnavailable } from "@/components/ui/custom/shared/Gamemode/GamemodeUnavailable";
import { useGamemode } from "@/hooks/gamemodes/useGamemode";

const Maps = () => {
    const { gamemode, loading } = useGamemode();
    const available = gamemode?.available ?? false;

    return (
        <>
            <Header />
            <main>
                <h1 className="mt-60 mb-6 text-center">Maps</h1>
                <div className="max-w-[900px] mx-auto mb-6 flex items-center gap-3 px-4">
                    <GamemodePicker />
                    {available && <MapFilters />}
                </div>

                {!loading && !available && (
                    <div className="pb-40">
                        <GamemodeUnavailable />
                    </div>
                )}

                {available && (
                    <div className="max-w-[900px] mx-auto px-4 pb-40 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
                        <section>
                            <Maplist />
                        </section>
                        <aside>
                            <Leaderboard />
                            <Guidelines />
                        </aside>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
};

export default Maps;
