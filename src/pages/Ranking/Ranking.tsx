import React from "react";
import { Header } from "@/components/sections/Header";
import { Navigation } from "@/components/layouts/Ranking/Navigation";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/sections/Footer";

const Ranking = () => {
    return (
        <>
            <Header />
            <main>
                <Navigation />
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default Ranking;
