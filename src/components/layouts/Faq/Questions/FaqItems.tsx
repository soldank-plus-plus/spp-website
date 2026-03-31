import React from "react";

export const faqItems = [
    {
        id: "item-1",
        question: "What exactly is Soldank++ about",
        answer: (
            <>
                Soldank++ is a unique 2D (side-view) arcade game made by Nedi.
                The main part of the game is based on passing various maps of
                difficulty with the possibility of achieving faster time than
                other players. Side modes offer a variety of multiplayer options
                including shooting competition, hide and seek, dodgeball,
                zombies and much more. List of full gameplay features can be
                found{" "}
                <a href="/gamemodes" className="underline hover:underline">
                    here
                </a>
                .
            </>
        ),
    },
    {
        id: "item-2",
        question: "Is this game a remake of another game",
        answer: (
            <>
                It is an upcoming remake based on the legendary 2D Soldat game,
                built on a newly rewritten C++ engine. It is not a direct remake
                of Soldat, but a separate community project with different game
                purposes that reimplements the original game mechanics and
                expands them using the new engine.
            </>
        ),
    },
    {
        id: "item-3",
        question: "Will gameplay be the same as the original game",
        answer: (
            <>
                The core game mechanics, including shooting and movement, will
                be replicated 1:1. While the mechanics are preserved, the game
                itself will have a different focus, emphasizing movement over
                shooting. However, all original game modes will be fully
                re-implemented and playable in the same way as in the original
                game.
            </>
        ),
    },
    {
        id: "item-4",
        question:
            "Are there any new features or improvements compared to Soldat",
        answer: (
            <>
                In early access, several new features and improvements have been
                introduced compared to the original game. Most of the core
                mechanics have been rewritten in C++, including a completely
                overhauled movement system based on a finite state machine —
                making it significantly easier to fix bugs and implement future
                changes. A new in-game map editor has also been added, allowing
                you to test maps instantly as you build. On top of that, we now
                have a fully functional lobby server and an official website.
            </>
        ),
    },
    {
        id: "item-5",
        question: "What platforms are supported (Windows/Linux/macOS/Web)",
        answer: (
            <>
                The game will be playable on all major platforms — Windows,
                Linux, macOS, and the Web. The technologies used in the project
                are cross-platform (macOS should work too but it was not
                tested).
            </>
        ),
    },
    {
        id: "item-6",
        question: "How do I install the game",
        answer: (
            <>
                Latest builds of the game are available at{" "}
                <a href="/earlyaccess" className="underline hover:underline">
                    Early Access
                </a>{" "}
                page. You can download it for Windows and Linux. macOS is not
                available as it has not been fully tested.
            </>
        ),
    },
    {
        id: "item-7",
        question: "How can I contribute",
        answer: (
            <>
                Fork any repository from{" "}
                <a
                    href="https://github.com/soldank-plus-plus"
                    className="underline hover:underline"
                >
                    https://github.com/soldank-plus-plus
                </a>{" "}
                and create a pull request. We can discuss the changes in
                #dev_chat on discord and we&apos;ll be happy to help you with
                anything! If you don&apos;t know anything about coding and you
                want to help us, more about contributing can be found{" "}
                <a href="/contributing" className="underline hover:underline">
                    here
                </a>
                !
            </>
        ),
    },
    {
        id: "item-8",
        question: "When is stable version coming out",
        answer: (
            <>
                There is no specific release date, as this project is developed
                in free time. Even if progress isn’t always visible, the project
                is being worked on and is not abandoned.
            </>
        ),
    },
];
