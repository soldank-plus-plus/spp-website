import React from "react";
import { motion } from "framer-motion";
import { LucideArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import game from "@/assets/backgrounds/game.png";

export const Hero = () => {
    return (
        <section
            className="relative w-full h-screen flex justify-center items-center px-6"
            style={{
                backgroundImage: `url(${game})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="relative max-w-6xl text-center text-white"
            >
                <h1 className="mt-60 mb-6">
                    Unique 2D (side-view) arcade game
                    <br />
                    Soldank++
                </h1>

                <p className="mb-10 max-w-3xl mx-auto">
                    The main part of the game is based on passing various maps
                    of difficulty with the possibility of achieving faster time
                    than other players. Side modes offer a variety of
                    multiplayer options including shooting competition, hide and
                    seek, dodgeball, zombies and more!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xs mx-auto">
                    <Button
                        size="lg"
                        className="bg-accent hover:bg-accenthover w-full sm:w-auto"
                    >
                        Early Access
                        <LucideArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto "
                    >
                        Contribute
                    </Button>
                </div>
            </motion.div>
        </section>
    );
};
