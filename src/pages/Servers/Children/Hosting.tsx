import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import { Footer } from "@/components/ui/custom/core/Footer";
import underconstr from "@/assets/icons/underconstr.png";

const Hosting = () => {
    return (
        <>
            <Header />
            <main className="flex justify-center items-center min-h-screen px-4">
                <img src={underconstr} alt="Under construction" />
            </main>
            <Footer />
        </>
    );
};

export default Hosting;
