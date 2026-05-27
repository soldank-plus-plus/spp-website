import React from "react";
import underconstr from "@/assets/icons/underconstr.png";
import { PositionsTable } from "@/components/layouts/Ranking/Children/Positions/PositionsTable";

export const Positions: React.FC = () => {
    return (
        <section className="flex justify-center px-4">
            <PositionsTable />
        </section>
    );
};
