import React from "react";
import { RecordsTable } from "@/components/layouts/Ranking/Children/Records/RecordsTable";

export const GlobalRecords: React.FC = () => {
    return (
        <section className="flex justify-center px-4">
            <RecordsTable />
        </section>
    );
};
