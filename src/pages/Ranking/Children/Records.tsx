import React from "react";
import underconstr from "@/assets/icons/underconstr.png";
import { RecordsTable } from "@/components/layouts/Country/CountryTable/CountryTable"; // Uncomment when ready

export const Records: React.FC = () => {
    return (
        <section className="flex justify-center items-center min-h-screen px-4">
            <img src={underconstr} alt="Under construction" />
        </section>
    );
};
