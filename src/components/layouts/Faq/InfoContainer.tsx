import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";

export const InfoContainer = () => {
    return (
        <div className="relative px-6 sm:px-12 lg:px-20 flex justify-center items-center mb-10">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="relative max-w-6xl w-full text-white"
            >
                <h1 className="mt-60 mb-6 text-center">
                    Frequently Asked Questions
                </h1>

                <div className="mx-auto max-w-md space-y-4">
                    <p className="text-left">
                        Find answers to the most common questions about
                        gameplay, modes, and features. If you're new or curious,
                        this is a great place to start. If you’d like to see
                        what’s coming in the future, tap Roadmap to view our
                        plan.
                    </p>

                    <Button
                        size="lg"
                        className="bg-accent hover:bg-accenthover w-full sm:w-auto"
                    >
                        Roadmap
                        <ListTodo className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
