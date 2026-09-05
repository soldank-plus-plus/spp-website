import React, { useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/shadcn/chart";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useClanUsers } from "@/hooks/clans/useClanUsers";
import { useClanRecordsHistory } from "@/hooks/clans/useClanRecordsHistory";

const chartConfig = {
    records: { label: "Records", color: "#54a8e3" },
    gold: { label: "Gold", color: "#FFD700" },
    silver: { label: "Silver", color: "#C0C0C0" },
    bronze: { label: "Bronze", color: "#CD7F32" },
} satisfies ChartConfig;

const SERIES = ["records", "gold", "silver", "bronze"] as const;

interface Props {
    clanId: number;
}

export const StatisticsChart: React.FC<Props> = ({ clanId }) => {
    const [excludedIds, setExcludedIds] = useState<number[]>([]);

    const {
        users,
        loading: usersLoading,
        error: usersError,
    } = useClanUsers({ clanId });

    const selectedIds = users
        .map((user) => user.id)
        .filter((id) => !excludedIds.includes(id));

    const { points, loading, error } = useClanRecordsHistory({
        clanId,
        userIds: selectedIds,
    });

    const toggle = (userId: number) =>
        setExcludedIds((current) =>
            current.includes(userId)
                ? current.filter((id) => id !== userId)
                : [...current, userId]
        );

    const hasSelection = selectedIds.length > 0;
    const showChart = hasSelection && !loading && !error;

    if (usersError) return null;

    return (
        <section className="border-t border-white/10 mt-10 pt-8">
            <h3 className="mb-4">Statistics</h3>

            <div className="pl-6">
                <div className="mb-4 flex flex-wrap gap-2">
                    {usersLoading
                        ? [0, 1, 2, 3].map((i) => (
                              <Skeleton key={i} className="h-7 w-28 rounded" />
                          ))
                        : users.map((user) => (
                              <button
                                  key={user.id}
                                  onClick={() => toggle(user.id)}
                                  aria-pressed={!excludedIds.includes(user.id)}
                                  className={`rounded px-2 py-1 text-sm transition-colors ${
                                      excludedIds.includes(user.id)
                                          ? "text-secondary hover:text-heading"
                                          : "bg-gray-800 text-heading font-semibold"
                                  }`}
                              >
                                  {user.username}
                              </button>
                          ))}
                </div>

                {!hasSelection && (
                    <p className="py-8 text-center text-secondary">
                        Select at least one player.
                    </p>
                )}

                {hasSelection && loading && (
                    <Skeleton className="h-[300px] w-full" />
                )}

                {hasSelection && error && (
                    <p className="py-8 text-center text-sm text-red-500">
                        {error}
                    </p>
                )}

                {showChart && points.length === 0 && (
                    <p className="py-8 text-center text-secondary">
                        No records yet.
                    </p>
                )}

                {showChart && points.length > 0 && (
                    <ChartContainer config={chartConfig} className="w-full">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={points}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    width={32}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                />
                                {SERIES.map((key) => (
                                    <Line
                                        key={key}
                                        dataKey={key}
                                        type="monotone"
                                        stroke={`var(--color-${key})`}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </div>
        </section>
    );
};
