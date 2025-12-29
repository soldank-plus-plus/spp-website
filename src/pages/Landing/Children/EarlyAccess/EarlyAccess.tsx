import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import Preview from "@/components/layouts/Landing/Children/EarlyAccess/Preview";
import { Footer } from "@/components/ui/custom/core/Footer";

const EarlyAccess = () => {
    return (
        <>
            <Header />
            <main>
                <Preview />
            </main>
            <Footer />
        </>
    );
};

export default EarlyAccess;
