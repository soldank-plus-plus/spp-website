import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import login from "@/assets/icons/login.png";

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="container flex justify-between items-center px-6 sm:px-12 lg:px-20 h-16">

                {/* Desktop devices */}
                <nav className="hidden md:flex items-center gap-4 sm:gap-6 lg:gap-8 text-sm font-tomorrow font-semibold uppercase">
                    <a
                        href="/"
                        className="text-2xl sm:text-3xl lg:text-4xl text-white font-tomorrow font-bold uppercase"
                    >
                        S++
                    </a>
                    <Link to="/ranking">Ranking</Link>
                    <Link to="/gamemodes">Gamemodes</Link>
                    <Link to="/maps">Maps</Link>
                    <Link to="/learn">Learn</Link>
                    <Link to="/servers">Servers</Link>
                    <Link to="/faq">FAQ</Link>
                </nav>

                <div className="hidden md:flex items-center ml-4">
                    <a href="/">
                        <img
                            src={login}
                            alt="Login"
                            className="h-11 w-auto transition-opacity duration-300 hover:opacity-50"
                        />
                    </a>
                </div>

                {/* Mobile devices */}
                <div className="md:hidden absolute right-6 top-1/2 -translate-y-1/2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6 text-white" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="bg-black/90 text-white overflow-y-auto"
                        >
                            <nav className="flex flex-col gap-4 mt-6 font-tomorrow font-semibold uppercase px-6">
                                <Link to="/ranking">Ranking</Link>
                                <Link to="/gamemodes">Gamemodes</Link>
                                <Link to="/maps">Maps</Link>
                                <Link to="/learn">Learn</Link>
                                <Link to="/servers">Servers</Link>
                                <Link to="/faq">FAQ</Link>

                                <div className="pt-4 flex flex-col gap-2 w-full font-tomorrow">
                                    <Button variant="ghost" className="w-full">
                                        SIGN IN
                                    </Button>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};
