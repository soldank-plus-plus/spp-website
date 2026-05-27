import React from "react";
import { CountryTable } from "@/components/layouts/Ranking/Children/Country/CountryTable";

export const Country: React.FC = () => {
    return (
        <section className="mt-6">
            <CountryTable />
        </section>
    );
};
