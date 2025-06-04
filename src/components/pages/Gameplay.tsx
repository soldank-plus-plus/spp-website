import React, { useEffect, useState } from "react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { AppSidebar } from "@/components/layouts/Gameplay/AppSidebar";

const Gameplay = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 768);
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <Header />
            <div className="flex">
                <AppSidebar />
                <main
                    className={`flex-1 min-h-screen pt-16 transition-all duration-300`}
                    style={{
                        marginLeft: isMobile ? 0 : "16rem", // 16rem = sidebar width on desktop
                    }}
                >
                    <h1>Gamemodes Page Content</h1>
                    {/* your other content */}
                </main>
            </div>
            <Footer />
        </>
    );
};

export default Gameplay;
