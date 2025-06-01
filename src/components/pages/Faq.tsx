import React from "react";
import { Header } from "@/components/sections/Header";
import { InfoContainer } from "@/components/layouts/Faq/InfoContainer";
import { Questions } from "@/components/layouts/Faq/Questions";
import { Contact } from "@/components/layouts/Faq/Contact";
import { Footer } from "@/components/sections/Footer";

const Faq = () => {
    return (
        <>
            <Header />
            <main>
                <InfoContainer />
                <Questions />
                <Contact />
            </main>
            <Footer />
        </>
    );
};

export default Faq;
