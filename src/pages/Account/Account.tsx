import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import { Navigation } from "@/components/layouts/Account/Navigation";
import Sidebar from "@/components/layouts/Account/Children/Sidebar";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/ui/custom/core/Footer";

const Account: React.FC = () => {
    return (
        <>
            <Header />
            <main>
                <Navigation />
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[320px_3fr] gap-8 px-4 mb-20">
                    <Sidebar />
                    <Outlet />
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Account;
