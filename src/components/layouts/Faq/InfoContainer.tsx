import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";
import { Link } from "react-router-dom";

export const InfoContainer = () => {
    return (
        <div className="relative px-6 sm:px-12 lg:px-20 flex justify-center items-center mb-10">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative max-w-6xl w-full text-white"
            >
                <motion.h1
                    className="mt-60 mb-6 text-center"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    Frequently Asked Questions
                </motion.h1>

                <motion.div
                    className="mx-auto max-w-md space-y-4"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                >
                    <p className="text-left">
                        Find answers to the most common questions about
                        gameplay, modes, and features. If you're new or curious,
                        this is a great place to start. If you’d like to see
                        what’s coming in the future, tap Roadmap to view our
                        plan.
                    </p>

                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                            duration: 1,
                            delay: 0.6,
                            ease: "easeOut",
                        }}
                    >
                        <Button asChild size="lg" variant="ghostInverted">
                            <Link
                                to="/roadmap"
                                className="text-inherit no-underline inline-flex items-center"
                            >
                                Roadmap
                                <ListTodo className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};
