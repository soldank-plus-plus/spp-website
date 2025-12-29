import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import { InfoContainer } from "@/components/layouts/Faq/InfoContainer";
import { Questions } from "@/components/layouts/Faq/Questions/Questions";
import { Contact } from "@/components/layouts/Faq/Contact";
import { Footer } from "@/components/ui/custom/core/Footer";

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
