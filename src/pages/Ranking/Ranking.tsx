import { Header } from "@/components/ui/custom/core/Header";
import { Navigation } from "@/components/layouts/Ranking/Children/Climb/Navigation";
import { RankingHeader } from "@/components/layouts/Ranking/RankingHeader";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/ui/custom/core/Footer";
import { GamemodeUnavailable } from "@/components/ui/custom/shared/Gamemode/GamemodeUnavailable";
import { useGamemode } from "@/hooks/core/useGamemode";

const Ranking = () => {
    const { gamemode, loading } = useGamemode();
    const available = gamemode?.available ?? false;

    return (
        <>
            <Header />
            <main>
                <div className="mb-8 px-4">
                    <RankingHeader />
                    {available && <Navigation />}
                </div>

                {available && <Outlet />}
                {!loading && !available && <GamemodeUnavailable />}
            </main>
            <Footer />
        </>
    );
};

export default Ranking;
