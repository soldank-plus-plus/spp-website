import React from "react";
import { motion } from "framer-motion";
import { LucideArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
                <motion.h1
                    className="mt-60 mb-6"
                    initial={{ y: -300 }}
                    animate={{ y: [-300, 0, 20, 0] }}
                    transition={{
                        duration: 1.2,
                        ease: "easeOut",
                        times: [0, 0.5, 0.8, 1],
                    }}
                >
                    Unique 2D (side-view) arcade game
                    <br />
                    Soldank++
                </motion.h1>

                <motion.p
                    className="mb-10 max-w-3xl mx-auto"
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                >
                    The main part of the game is based on passing various maps
                    of difficulty with the possibility of achieving faster time
                    than other players. Side modes offer a variety of
                    multiplayer options including shooting competition, hide and
                    seek, dodgeball, zombies and more!
                </motion.p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xs mx-auto">
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                            duration: 1,
                            delay: 1.4,
                            ease: "easeOut",
                        }}
                    >
                        <Button asChild size="lg" variant="ghostInverted">
                            <Link
                                to="/earlyaccess"
                                className="text-inherit no-underline inline-flex items-center"
                            >
                                Early Access
                                <LucideArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                            duration: 1,
                            delay: 1.6,
                            ease: "easeOut",
                        }}
                    >
                        <Button size="lg" variant="default">
                            <Link
                                to="/contributing"
                                className="text-inherit no-underline inline-flex items-center"
                            >
                                Contribute
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};
