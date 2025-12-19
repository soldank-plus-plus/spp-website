import React from "react";
import { Header } from "@/components/sections/Header";
import LoginCard from "@/components/layouts/Auth/LoginCard"; // <- bez { }
import { Footer } from "@/components/sections/Footer";

const Login: React.FC = () => {
    return (
        <>
            <Header />
            <main>
                <LoginCard />
            </main>
            <Footer />
        </>
    );
};

export default Login;
