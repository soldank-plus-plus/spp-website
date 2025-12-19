import React from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    ResponsiveContainer,
} from "recharts";
import {
    ChartContainer,
    ChartLegend,
    ChartConfig,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/shadcn/chart";
import features from "./roadmapData";

export default function RoadmapChart() {
    const chartData = Object.entries(features).map(([category, items]) => ({
        category,
        done: items.filter((f) => f.status === "done").length,
        planned: items.filter((f) => f.status === "planned").length,
    }));

    const chartConfig = {
        done: { label: "Done", color: "#2e4183" },
        planned: { label: "Planned", color: "#54a8e3" },
    } satisfies ChartConfig;

    return (
        <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 flex justify-center mb-28">
            <div className="w-full max-w-3xl">
                <ChartContainer
                    config={chartConfig}
                    className="min-h-[200px] w-full"
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="category"
                                tickLine={false}
                                axisLine={false}
                                interval={0}
                                angle={-23} // Name inclination
                                textAnchor="end"
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar
                                dataKey="done"
                                fill="var(--color-done)"
                                radius={4}
                            />
                            <Bar
                                dataKey="planned"
                                fill="var(--color-planned)"
                                radius={4}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>
    );
}
