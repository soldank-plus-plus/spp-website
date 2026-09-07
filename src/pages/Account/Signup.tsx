import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import SignupCard from "@/components/layouts/Account/SignupCard";
import { Footer } from "@/components/ui/custom/core/Footer";

const Signup: React.FC = () => {
    return (
        <>
            <Header />
            <main>
                <SignupCard />
            </main>
            <Footer />
        </>
    );
};

export default Signup;
