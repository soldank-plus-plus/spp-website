import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import login from "@/assets/icons/login.png";

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="container display-flex px-6">
                <div className="flex items-center justify-between h-16 ml-16">
                    <nav className="hidden md:flex items-center space-x-8 ml-60 text-sm font-tomorrow font-semibold uppercase">
                        <a
                            href="/"
                            className="text-4xl text-white font-tomorrow font-bold uppercase"
                        >
                            S++
                        </a>
                        <a href="#">Ranking</a>
                        <a href="#">Gamemodes</a>
                        <a href="#">Maps</a>
                        <a href="#">Learn</a>
                        <a href="#">Servers</a>
                        <a href="#">FAQ</a>
                    </nav>

                    <div className="hidden md:flex items-center space-x-4 font-semibold uppercase">
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
                                <nav className="flex flex-col gap-4 mt-6 font-tomorrow font-semibold uppercase">
                                    <a href="#">Ranking</a>
                                    <a href="#">Gamemodes</a>
                                    <a href="#">Maps</a>
                                    <a href="#">Learn</a>
                                    <a href="#">Servers</a>
                                    <a href="#">FAQ</a>

                                    <div className="pt-4 flex flex-col gap-2 w-full font-tomorrow">
                                        <Button
                                            variant="ghost"
                                            className="w-full"
                                        >
                                            SIGN IN
                                        </Button>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};
