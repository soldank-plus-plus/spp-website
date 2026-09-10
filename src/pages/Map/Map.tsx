import React from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { Header } from "@/components/ui/custom/core/Header";
import { Hero } from "@/components/layouts/Map/Hero";
import { Info } from "@/components/layouts/Map/Info";
import { MapTable } from "@/components/layouts/Map/MapTable/MapTable";
import { Footer } from "@/components/ui/custom/core/Footer";
import { parseRouteId } from "@/utils/routeParams";

const Map: React.FC = () => {
    const { mapId: mapIdParam } = useParams<{ mapId: string }>();
    const [searchParams] = useSearchParams();

    const mapId = parseRouteId(mapIdParam);
    const mapname = searchParams.get("name") ?? "";
    const category = searchParams.get("category") ?? "climb";

    if (mapId === null) return <Navigate to="/maps" replace />;

    return (
        <>
            <Header />
            <main>
                <Hero mapId={mapId} mapname={mapname} category={category} />
                <Info mapId={mapId} mapname={mapname} category={category} />
                <MapTable mapId={mapId} />
            </main>
            <Footer />
        </>
    );
};

export default Map;
