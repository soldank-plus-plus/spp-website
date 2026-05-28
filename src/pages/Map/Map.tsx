import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import { Footer } from "@/components/ui/custom/core/Footer";
import { MapRecordsTable } from "@/components/layouts/Map/MapRecordsTable";

const Map: React.FC = () => {
    return (
        <>
            <Header />
            <main>
                <section className="pt-2 pb-40">
                    <MapRecordsTable />
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Map;
