import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { Header } from "@/components/ui/custom/core/Header";
import { Footer } from "@/components/ui/custom/core/Footer";
import { ClanHeader } from "@/components/layouts/Clan/ClanHeader";
import { Members } from "@/components/layouts/Clan/Members";
import { Info } from "@/components/layouts/Clan/Info";
import { StatisticsChart } from "@/components/layouts/Clan/Statistics";
import { parseRouteId } from "@/utils/routeParams";

const Clan: React.FC = () => {
    const { clanId: clanIdParam } = useParams<{ clanId: string }>();

    const clanId = parseRouteId(clanIdParam);

    if (clanId === null) return <Navigate to="/ranking/clan" replace />;

    return (
        <>
            <Header />
            <main className="max-w-5xl mx-auto px-4 pt-40 pb-32">
                <ClanHeader clanId={clanId} />
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
                    <Members clanId={clanId} />
                    <Info clanId={clanId} />
                </div>
                <StatisticsChart clanId={clanId} />
            </main>
            <Footer />
        </>
    );
};

export default Clan;
