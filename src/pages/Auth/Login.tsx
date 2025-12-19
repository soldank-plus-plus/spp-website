import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import LoginCard from "@/components/layouts/Auth/LoginCard"; // <- bez { }
import { Footer } from "@/components/ui/custom/core/Footer";

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
