import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import { Leaderboard } from "@/components/layouts/Maps/Leaderboard";
import { Maplist } from "@/components/layouts/Maps/Maplist";
import { Footer } from "@/components/ui/custom/core/Footer";

const Maps = () => {
    return (
        <>
            <Header />
            <main>
                <h1 className="mt-60 mb-6 text-center text-white">Maps</h1>
                <div className="max-w-[900px] mx-auto px-4 pt-8 pb-40 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
                    <section>
                        <Maplist />
                    </section>
                    <aside className="lg:sticky lg:top-8">
                        <Leaderboard />
                    </aside>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Maps;
