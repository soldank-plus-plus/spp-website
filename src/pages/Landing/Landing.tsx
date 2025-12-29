import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import { Hero } from "@/components/layouts/Landing/Hero/Hero";
import { Frame } from "@/components/layouts/Landing/Frame";
import { TechShowcase } from "@/components/layouts/Landing/TechShowcase";
import { GameEngine } from "@/components/layouts/Landing/GameEngine";
import { Footer } from "@/components/ui/custom/core/Footer";

const Landing = () => {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <Frame />
                <TechShowcase />
                <GameEngine />
            </main>
            <Footer />
        </>
    );
};

export default Landing;
