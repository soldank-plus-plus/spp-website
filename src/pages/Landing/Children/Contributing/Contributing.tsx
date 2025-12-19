import React from "react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
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
