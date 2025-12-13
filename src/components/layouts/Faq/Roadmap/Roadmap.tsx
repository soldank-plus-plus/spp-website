import React from "react";
import { Header } from "@/components/sections/Header";
import RoadmapFeat from "./RoadmapFeat";
import RoadmapChart from "./RoadmapChart";
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
