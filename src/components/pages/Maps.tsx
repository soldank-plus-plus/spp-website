import React from "react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import underconstr from "@/assets/icons/underconstr.png";

const Maps = () => {
    return (
        <>
            <Header />
            <main className="flex justify-center items-center min-h-screen px-4">
                <img
                    src={underconstr}
                    alt="Under construction"
                />
            </main>
            <Footer />
        </>
    );
};

export default Maps;
