import React from "react";
import { Header } from "@/components/sections/Header";
import { List } from "@/components/layouts/Gamemodes/List";
import { Footer } from "@/components/sections/Footer";

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
