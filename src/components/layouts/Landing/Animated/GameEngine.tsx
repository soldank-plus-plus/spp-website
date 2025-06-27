import React from "react";
import soldatgame from "@/assets/backgrounds/soldatgame.jpg";
import { SlideInSection } from "@/components/layouts/Landing/Animated/SlideInSection";

export const GameEngine = () => {
    return (
        <SlideInSection
            direction="right"
            className="flex flex-col items-center justify-center gap-5 w-full px-[30px] py-[120px] overflow-hidden relative"
        >
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 w-full max-w-[1000px]">
                <div className="flex flex-col justify-center items-start gap-y-4 text-left max-w-sm">
                    <h3>Clone of Soldat engine</h3>
                    <p className="text-sm text-white/70">
                        Soldank++ is an open-source clone of the Soldat game
                        engine initiated by lead developer Nedi. The primary
                        objective is to replicate all existing core mechanics
                        precisely while expanding upon them. Furthermore, the
                        project is committed to fully replacing certain legacy
                        features, such as netcode, with a server-authoritative
                        system, preventing some existing vulnerabilities.
                    </p>
                </div>
                <img src={soldatgame} alt="Soldat" className="rounded" />
            </div>
        </SlideInSection>
    );
};
