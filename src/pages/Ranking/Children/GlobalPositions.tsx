import React from "react";
import { PositionsTable } from "@/components/layouts/Ranking/Children/GlobalPositions/PositionsTable";

export const GlobalPositions: React.FC = () => {
    return (
        <section className="flex justify-center px-4">
            <PositionsTable />
        </section>
    );
};
