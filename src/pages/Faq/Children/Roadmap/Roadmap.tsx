import { Header } from "@/components/ui/custom/core/Header";
import RoadmapChart from "@/components/layouts/Faq/Children/Roadmap/RoadmapChart";
import RoadmapFeat from "@/components/layouts/Faq/Children/Roadmap/RoadmapFeat";
import { Footer } from "@/components/ui/custom/core/Footer";

export default function Roadmap() {
    return (
        <>
            <Header />
            <main>
                <RoadmapChart />
                <RoadmapFeat />
            </main>
            <Footer />
        </>
    );
}
