import React from "react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import RoadmapFeat from "./RoadmapFeat";
import RoadmapChart from "./RoadmapChart";

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
