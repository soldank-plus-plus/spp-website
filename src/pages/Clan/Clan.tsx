import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/ui/custom/core/Header";
import { Footer } from "@/components/ui/custom/core/Footer";
import { ClanHeader } from "@/components/layouts/Clan/ClanHeader";
import { Members } from "@/components/layouts/Clan/Members";
import { Info } from "@/components/layouts/Clan/Info";
import { StatisticsChart } from "@/components/layouts/Clan/Statistics";

const Clan: React.FC = () => {
    const { clanId: clanIdParam } = useParams<{ clanId: string }>();
    const navigate = useNavigate();

    const clanId = Number(clanIdParam);

    if (!clanIdParam || isNaN(clanId)) {
        navigate("/ranking/clan");
        return null;
    }

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
