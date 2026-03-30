import React, { useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface SlideInSectionProps {
    children: React.ReactNode;
    direction?: "left" | "right" | "up" | "down";
    delay?: number;
    className?: string;
    once?: boolean;
}

const directionMap = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    up: { x: 0, y: -100 },
    down: { x: 0, y: 100 },
};

export const SlideInSection: React.FC<SlideInSectionProps> = ({
    children,
    direction = "up",
    delay = 0,
    once = true,
    className = "",
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: "-100px" });
    const initialPos = directionMap[direction];

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, ...initialPos }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
        >
            <AnimatePresence>
                {isInView && (
                    <motion.div
                        variants={{
                            hidden: {},
                            show: {
                                transition: {
                                    staggerChildren: 0.15,
                                },
                            },
                        }}
                        initial="hidden"
                        animate="show"
                    >
                        {React.Children.map(children, (child) => (
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                transition={{ ease: "easeOut" }}
                            >
                                {child}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
