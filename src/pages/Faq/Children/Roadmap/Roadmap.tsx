import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import RoadmapFeat from "@/components/layouts/Faq/Children/Roadmap/RoadmapFeat";
import RoadmapChart from "@/components/layouts/Faq/Children/Roadmap/RoadmapChart";
import { Footer } from "@/components/ui/custom/core/Footer";

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
