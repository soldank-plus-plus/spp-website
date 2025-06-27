import React from "react";
import { GameCard } from "@/components/layouts/Gamemodes/GameCard";
import { motion } from "framer-motion";

interface Game {
    title: string;
    description: string;
    image: string;
    link: string;
}

const games: Game[] = [
    {
        title: "Aimlab",
        description:
            "Training platform to help sharpen up your core aiming skills, similar to the Aimlabs game.",
        image: "/src/assets/gamemodes/aimlabs.jpg",
        link: "#",
    },
    {
        title: "Boostmode",
        description:
            "Use speed-boosting weapons to reach the enemy base as quickly as possible.",
        image: "/src/assets/gamemodes/boostmode.png",
        link: "#",
    },
    {
        title: "Capture The Flag",
        description:
            "The goal is for each team to steal the enemy's flag and bring it to your own base.",
        image: "/src/assets/gamemodes/comingsoon.jpg",
        link: "#",
    },
    {
        title: "Chase & Run",
        description:
            "Chasers must choose a weapon to eliminate the runners. Avoiding capture requires agility, map knowledge, and teamwork.",
        image: "/src/assets/gamemodes/comingsoon.jpg",
        link: "#",
    },
    {
        title: "Deathmatch",
        description:
            "As the name implies, kill everything that moves. The player with the most frags wins the match.",
        image: "/src/assets/gamemodes/comingsoon.jpg",
        link: "#",
    },
    {
        title: "Dodgeball",
        description:
            "Two teams face off in an arena with a ball. Once hit, you're out for the rest of the round.",
        image: "/src/assets/gamemodes/comingsoon.jpg",
        link: "#",
    },
    {
        title: "Hold The Flag",
        description:
            "The team that holds the yellow flag gets points every couple of seconds.",
        image: "/src/assets/gamemodes/comingsoon.jpg",
        link: "#",
    },
    {
        title: "Hoverrace",
        description:
            "The Minigun’s rapid backward-fired pellets generate strong recoil, causing significant backward momentum.",
        image: "/src/assets/gamemodes/comingsoon.jpg",
        link: "#",
    },
    {
        title: "Infiltration",
        description:
            "The goal of the Alpha team is to steal the black flag from Bravo team's base.",
        image: "/src/assets/gamemodes/comingsoon.jpg",
        link: "#",
    },
    {
        title: "JumpTestLong",
        description:
            "A two-team game mode where players must make long-distance jumps to reach the enemy base.",
        image: "/src/assets/gamemodes/comingsoon.jpg",
        link: "#",
    },
    {
        title: "Pointmatch",
        description:
            "Similar to Hold The Flag mode, but it's deathmatch instead of team-based format.",
        image: "/src/assets/gamemodes/comingsoon.jpg",
        link: "#",
    },
    {
        title: "Portal",
        description:
            "Inspired by the Portal game series, players solve puzzles using two linked portals.",
        image: "/src/assets/gamemodes/portal.jpg",
        link: "#",
    },
    {
        title: "Prop Hunt",
        description:
            "The props are disguised as objects around the map and merge with the environment hiding from the hunter.",
        image: "/src/assets/gamemodes/prophunt.jpg",
        link: "#",
    },
    {
        title: "Rambomatch",
        description:
            "Similar to Deathmatch with one main tweak: Rambo Bow spawns at a set location on each map.",
        image: "/src/assets/gamemodes/comingsoon.jpg",
        link: "#",
    },
    {
        title: "Runmode",
        description:
            "Fast-paced gamemode focused on speedrunning through custom maps and their routes, improving your movement speed.",
        image: "/src/assets/gamemodes/runmode.png",
        link: "#",
    },
    {
        title: "Save Climb",
        description:
            "This mode is just like the main climb gamemode, but you get 5 saves per map.",
        image: "/src/assets/gamemodes/comingsoon.jpg",
        link: "#",
    },
    {
        title: "Teammatch",
        description:
            "Purpose is for each team to kill as many players as possible from the other teams.",
        image: "/src/assets/gamemodes/comingsoon.jpg",
        link: "#",
    },
    {
        title: "Volleyball",
        description:
            "A game mode similar to volleyball, where teams hit a ball back and forth trying to score on the opposing side.",
        image: "/src/assets/gamemodes/comingsoon.jpg",
        link: "#",
    },
];

export const List: React.FC = () => {
    return (
        <div className="pt-60">
            <h1 className="mb-6 text-center">Gamemodes</h1>

            <p className="mx-auto max-w-3xl text-center">
                Alternatively, take a break from climbing the maps to exciting
                multiplayer experiences. Whether it's a tense game of chase &
                run, a fast-paced shooting match, prop hunt, or surviving waves
                of zombies!
            </p>

            <div className="flex justify-center items-center min-h-screen px-4 my-20">
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {games.map((game) => (
                        <GameCard key={game.title} {...game} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
