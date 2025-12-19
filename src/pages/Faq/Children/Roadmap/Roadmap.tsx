import React from "react";
import { Header } from "@/components/sections/Header";
import RoadmapFeat from "@/components/layouts/Faq/Children/Roadmap/RoadmapFeat";
import RoadmapChart from "@/components/layouts/Faq/Children/Roadmap/RoadmapChart";
import { Footer } from "@/components/sections/Footer";

export default function Roadmap() {
    return (
        <>
            <Header />
            <main>
                <RoadmapFeat />
                <RoadmapChart />
            </main>
            <Footer />
        </>
    );
}
