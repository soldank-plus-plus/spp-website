import React from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/ui/custom/core/Header";
import { Footer } from "@/components/ui/custom/core/Footer";
import NotFound from "@/components/ui/custom/core/NotFound";
import { GamemodeInfo } from "@/components/layouts/Gamemodes/Children/Gamemode/GamemodeInfo";
import { GamemodeGallery } from "@/components/layouts/Gamemodes/Children/Gamemode/GamemodeGallery";
import { GamemodeDetails } from "@/components/layouts/Gamemodes/Children/Gamemode/GamemodeDetails";
import { GamemodeSidebar } from "@/components/layouts/Gamemodes/Children/Gamemode/GamemodeSidebar";
import { findGame } from "@/components/layouts/Gamemodes/List/listTypes";

const Gamemode: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const game = findGame(slug);

    if (!game) return <NotFound />;

    return (
        <>
            <Header />
            <main className="max-w-[1200px] mx-auto px-4 pt-40 pb-32">
                <GamemodeInfo game={game} />

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_280px]">
                    <div>
                        <GamemodeGallery slug={game.slug} />
                        <GamemodeDetails game={game} />
                    </div>

                    <GamemodeSidebar game={game} />
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Gamemode;
