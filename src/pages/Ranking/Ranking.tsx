import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import { Navigation } from "@/components/layouts/Ranking/Navigation";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/ui/custom/core/Footer";

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
