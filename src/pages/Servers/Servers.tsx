import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import Fetching from "@/components/layouts/Servers/Fetching/Fetching";
import YourServer from "@/components/layouts/Servers/YourServer";
import { Footer } from "@/components/ui/custom/core/Footer";

const Servers = () => {
    return (
        <>
            <Header />
            <main>
                <Fetching />
                <YourServer />
            </main>
            <Footer />
        </>
    );
};

export default Servers;
