"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState } from "react";

interface MedalChartProps {
    gold: number;
    silver: number;
    bronze: number;
    noMedal: number;
}

const COLORS = {
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#CD7F32",
    noMedal: "#444444",
};

export function Recharts({ gold, silver, bronze, noMedal }: MedalChartProps) {
    const total = gold + silver + bronze + noMedal;

    const data = [
        { name: "Gold", value: gold, color: COLORS.gold },
        { name: "Silver", value: silver, color: COLORS.silver },
        { name: "Bronze", value: bronze, color: COLORS.bronze },
        { name: "No Medal", value: noMedal, color: COLORS.noMedal },
    ].filter((d) => d.value > 0);

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const activeItem = activeIndex !== null ? data[activeIndex] : null;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 rounded-xl flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            dataKey="value"
                            stroke="#000000"
                            strokeWidth={2}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            {data.map((entry, i) => (
                                <Cell
                                    key={i}
                                    fill={entry.color}
                                    style={{
                                        cursor: "pointer",
                                        filter:
                                            activeIndex === i
                                                ? "brightness(0.85)"
                                                : "none",
                                        transition: "filter 0.3s",
                                    }}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-3xl font-mono font-black transition-all duration-300">
                        {activeItem ? activeItem.value : total}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider transition-all duration-300">
                        {activeItem
                            ? `${activeItem.name.toUpperCase()}S`
                            : "Medals"}
                    </span>
                </div>
            </div>
        </div>
    );
}
