import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import { Footer } from "@/components/ui/custom/core/Footer";
import Contribute from "@/components/layouts/Landing/Children/Contributing/Contribute";

const Contributing = () => {
    return (
        <>
            <Header />
            <main>
                <Contribute />
            </main>
            <Footer />
        </>
    );
};

export default Contributing;
