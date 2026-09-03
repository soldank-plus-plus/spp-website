import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Header } from "@/components/ui/custom/core/Header";
import { Footer } from "@/components/ui/custom/core/Footer";
import { ClanHeader } from "@/components/layouts/Clan/ClanHeader";
import { ClanMembers } from "@/components/layouts/Clan/ClanMembers";
import { MainStats } from "@/components/layouts/Clan/MainStats";

const Clan: React.FC = () => {
    const { clanId: clanIdParam } = useParams<{ clanId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const clanId = Number(clanIdParam);
    const clanname = searchParams.get("name") ?? "";

    if (!clanIdParam || isNaN(clanId)) {
        navigate("/ranking/clan");
        return null;
    }

    return (
        <>
            <Header />
            <main className="max-w-5xl mx-auto px-4 pt-40 pb-32">
                <ClanHeader clanId={clanId} clanname={clanname} />
                <ClanMembers clanId={clanId} clanname={clanname} />
                <MainStats clanId={clanId} clanname={clanname} />
            </main>
            <Footer />
        </>
    );
};

export default Clan;
