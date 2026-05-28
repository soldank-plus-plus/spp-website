import React from "react";
import { PositionsTable } from "@/components/layouts/Ranking/Children/Positions/PositionsTable";

export const GlobalPositions: React.FC = () => {
    return (
        <section className="flex justify-center px-4">
            <PositionsTable />
        </section>
    );
};
