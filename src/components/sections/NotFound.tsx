import React from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { ArrowLeft } from "lucide-react";
import notfound from "@/assets/backgrounds/notfound.png";

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 my-20">
                <img
                    src={notfound}
                    alt="404 Not Found"
                    className="max-w-xs sm:max-w-sm md:max-w-md mb-8"
                />
                <h2 className="mb-4">This page isn't available</h2>

                <p>
                    The link you followed may be broken, or the page may have
                    been removed.
                </p>

                <Link
                    to="/"
                    className="group inline-flex items-center overflow-hidden"
                >
                    <span className="relative">
                        Go back to homepage
                        <span className="absolute bottom-0 left-0 h-[2px] bg-secondary w-0 group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <ArrowLeft className="ml-1 w-4 h-4 opacity-100 transition-all duration-300 group-hover:opacity-0" />
                </Link>
            </main>
            <Footer />
        </div>
    );
}
