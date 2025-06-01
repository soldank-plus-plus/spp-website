import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const faqItems = [
    {
        id: "item-1",
        question: "What exactly is Soldank++ about",
        answer:
            "Soldank++ is a unique 2D (side-view) arcade game based on legendary 2D Soldat game engine made by Nedi. The main part of the game is based on passing various maps of difficulty with the possibility of achieving faster time than other players. Side modes offer a variety of multiplayer options incluidng shooting competition, hide and seek, dodgeball, zombies and much more. List of full gameplay features can be found <a href=\"/gamemodes\">here</a>.",
    },
    {
        id: "item-2",
        question: "Will gameplay be the same as the original",
        answer:
            "Yes! That’s the main goal of the project — The primary objective is to replicate all existing core mechanics precisely while expanding upon them. Furthermore, the project is committed to fully replacing certain legacy features, such as netcode, with a server-authoritative system, preventing some existing vulnerabilities.",
    },
    {
        id: "item-3",
        question: "Are there any new features or improvements compared to Soldat",
        answer:
            "As of now, several new features and improvements have been introduced compared to the original game. Most of the core mechanics have been rewritten in C++, including a completely overhauled movement system based on a finite state machine — making it significantly easier to fix bugs and implement future changes. A new in-game map editor has also been added, allowing you to test maps instantly as you build. On top of that, we now have a fully functional lobby server and an official website. Follow us on social media to stay updated on the latest developments.",
    },
    {
        id: "item-4",
        question: "What platforms are supported (Windows/Linux/macOS/Web)",
        answer:
            "The game will be playable on all major platforms — Windows, Linux, macOS, and the Web. The technologies used in the project fully cross-platform. The latest binaries are available for download (macOS should work too but it was not tested).",
    },
    {
        id: "item-5",
        question: "How do I install the game",
        answer:
            "Latest build of the game is available at: <a href=\"https://github.com/soldank-plus-plus/soldank-plus-plus/releases/tag/release-latest\">https://github.com/soldank-plus-plus/soldank-plus-plus/releases/tag/release-latest</a>.",
    },
    {
        id: "item-6",
        question: "How can I contribute",
        answer:
            "Fork any repository from <a href=\"https://github.com/soldank-plus-plus\">https://github.com/soldank-plus-plus</a> and create a pull request. We can discuss the changes in #dev_chat on discord and we'll be happy to help you with anything! If you don't know anything about coding and you want to help us, more about contributing can be found <a href=\"/contributing\">here</a>!",
    },
];

export const Questions = () => {
    const [search, setSearch] = useState("");

    const filteredItems = faqItems.filter((item) =>
        item.question.toLowerCase().includes(search.toLowerCase())
    );

    const baseTransition = { duration: 0.6, ease: "easeOut" };

    return (
        <section className="max-w-3xl mx-auto px-4 py-12">
            <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...baseTransition, delay: 0 }}
                className="text-center mb-6 text-2xl font-semibold"
            >
                Quick Answers
            </motion.h2>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...baseTransition, delay: 0.1 }}
                className="relative mb-8"
            >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search questions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </motion.div>

            <Accordion type="single" collapsible className="space-y-2">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                ...baseTransition,
                                delay: 0.2 + (filteredItems.length - 1 - index) * 0.1,
                            }}
                        >
                            <AccordionItem value={item.id}>
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent className="[&_a]:underline [&_a:hover]:underline">
                                    <span dangerouslySetInnerHTML={{ __html: item.answer }} />
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-dark text-center">No results found.</p>
                )}
            </Accordion>
        </section>
    );
};
