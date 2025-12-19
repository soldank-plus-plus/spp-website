import React from "react";
import { Header } from "@/components/sections/Header";
import Fetching from "@/components/layouts/Servers/Fetching/Fetching";
import YourServer from "@/components/layouts/Servers/YourServer";
import { Footer } from "@/components/sections/Footer";

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
