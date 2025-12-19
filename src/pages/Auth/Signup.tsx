import React from "react";
import { Header } from "@/components/sections/Header";
import SignupCard from "@/components/layouts/Auth/SignupCard"; // <- bez { }
import { Footer } from "@/components/sections/Footer";

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
