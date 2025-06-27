import React from "react";

export const faqItems = [
    {
        id: "item-1",
        question: "What exactly is Soldank++ about",
        answer: (
            <>
                Soldank++ is a unique 2D (side-view) arcade game based on the legendary 2D Soldat engine made by Nedi. The main part of the game is based on passing various maps of difficulty with the possibility of achieving faster time than other players. Side modes offer a variety of multiplayer options including shooting competition, hide and seek, dodgeball, zombies and much more. List of full gameplay features can be found {" "}
<a href="/gamemodes" className="underline hover:underline">
    here
    </a>
        .
    </>
),
},
{
    id: "item-2",
        question: "Will gameplay be the same as the original",
    answer: (
    <>
        Yes! That’s the main goal of the project — The primary objective is to replicate all existing core mechanics precisely while expanding upon them. Furthermore, the project is committed to fully replacing certain legacy features, such as netcode, with a server-authoritative system, preventing some existing vulnerabilities.
</>
),
},
{
    id: "item-3",
        question: "Are there any new features or improvements compared to Soldat",
    answer: (
    <>
        As of now, several new features and improvements have been introduced compared to the original game. Most of the core mechanics have been rewritten in C++, including a completely overhauled movement system based on a finite state machine — making it significantly easier to fix bugs and implement future changes. A new in-game map editor has also been added, allowing you to test maps instantly as you build. On top of that, we now have a fully functional lobby server and an official website. Follow us on social media to stay updated on the latest developments.
</>
),
},
{
    id: "item-4",
        question: "What platforms are supported (Windows/Linux/macOS/Web)",
    answer: (
    <>
        The game will be playable on all major platforms — Windows, Linux, macOS, and the Web. The technologies used in the project are cross-platform. The latest binaries are available for download (macOS should work too but it was not tested).
    </>
),
},
{
    id: "item-5",
        question: "How do I install the game",
    answer: (
    <>
        Latest build of the game is available at:{" "}
    <a
        href="https://github.com/soldank-plus-plus/soldank-plus-plus/releases/tag/release-latest"
    className="underline hover:underline"
        >
        https://github.com/soldank-plus-plus/soldank-plus-plus/releases/tag/release-latest
    </a>
        .
    </>
),
},
{
    id: "item-6",
        question: "How can I contribute",
    answer: (
    <>
        Fork any repository from {" "}
    <a
        href="https://github.com/soldank-plus-plus"
    className="underline hover:underline"
        >
        https://github.com/soldank-plus-plus
    </a>{" "}
    and create a pull request. We can discuss the changes in #dev_chat on discord and we&apos;ll be happy to help you with anything! If you don&apos;t know anything about coding and you want to help us, more about contributing can be found {" "}
    <a href="/contributing" className="underline hover:underline">
    here
    </a>
    !
        </>
),
},
];
