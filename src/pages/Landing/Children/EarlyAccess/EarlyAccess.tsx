import React from "react";
import { Header } from "@/components/sections/Header";
import Preview from "@/components/layouts/Landing/Children/EarlyAccess/Preview";
import { Footer } from "@/components/sections/Footer";

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
