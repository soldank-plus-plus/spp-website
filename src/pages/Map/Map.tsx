import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Header } from "@/components/ui/custom/core/Header";
import { Preview } from "@/components/layouts/Map/Preview";
import { Info } from "@/components/layouts/Map/Info";
import { MapTable } from "@/components/layouts/Map/MapTable/MapTable";
import { Footer } from "@/components/ui/custom/core/Footer";

const Map: React.FC = () => {
    const { mapId: mapIdParam } = useParams<{ mapId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const mapId = Number(mapIdParam);
    const mapname = searchParams.get("name") ?? "";

    if (!mapIdParam || isNaN(mapId)) {
        navigate("/maps");
        return null;
    }

    return (
        <>
            <Header />
            <main>
                <Preview mapname={mapname} />
                <Info mapId={mapId} mapname={mapname} />
                <MapTable mapId={mapId} />
            </main>
            <Footer />
        </>
    );
};

export default Map;
