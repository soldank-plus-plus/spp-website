import React from "react";
import { Header } from "@/components/sections/Header";

const Maps = () => {
    return (
        <>
            <Header />
            <main className="flex flex-col min-h-screen pt-16">
                <div className="relative w-full h-[calc(100vh-64px)]">
                    <iframe
                        src="/mapviewer/index.html"
                        title="Mapviewer"
                        className="w-full h-full border-0"
                        allowFullScreen
                    />
                </div>
            </main>
        </>
    );
};

export default Maps;
