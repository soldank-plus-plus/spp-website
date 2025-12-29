import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import { List } from "@/components/layouts/Gamemodes/List/List";
import { Footer } from "@/components/ui/custom/core/Footer";

const Gamemodes = () => {
    return (
        <>
            <Header />
            <main>
                <List />
            </main>
            <Footer />
        </>
    );
};

export default Gamemodes;
