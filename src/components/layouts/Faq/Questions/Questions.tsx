import React, { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/components/layouts/Faq/Questions/FaqItems";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export const Questions = () => {
    const [search, setSearch] = useState("");

    const filteredItems = faqItems.filter((item) =>
        item.question.toLowerCase().includes(search.toLowerCase())
    );

    const baseTransition = { duration: 0.6, ease: "easeOut" };

    return (
        <section className="max-w-3xl mx-auto px-4 py-12">
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
                                delay:
                                    0.2 +
                                    (filteredItems.length - 1 - index) * 0.1,
                            }}
                        >
                            <AccordionItem value={item.id}>
                                <AccordionTrigger>
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="[&_a]:underline [&_a:hover]:underline">
                                    <AccordionContent className="[&_a]:underline [&_a:hover]:underline">
                                        {item.answer}
                                    </AccordionContent>
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
