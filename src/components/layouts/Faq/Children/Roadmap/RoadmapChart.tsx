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
        <div className="w-full flex flex-col items-center px-4">
            <div className="max-w-3xl w-full mb-12 text-center">
                <h1 className="mt-60 mb-6">Roadmap</h1>
                <p className="mx-auto max-w-3xl text-center">
                    Explore our development roadmap to see the progress of key
                    game systems, upcoming features, and improvements. Here you
                    can track what&apos;s completed and what&apos;s planned for
                    future updates.
                </p>
            </div>
            <div className="w-full max-w-3xl mb-8">
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
                                angle={-23}
                                textAnchor="end"
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend
                                content={(props) => (
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    <ChartLegendContent {...(props as any)} />
                                )}
                            />
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
