import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import SignupCard from "@/components/layouts/Auth/SignupCard"; // <- bez { }
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
