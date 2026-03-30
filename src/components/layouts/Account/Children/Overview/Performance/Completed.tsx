"use client";

import React from "react";

interface CompletedProps {
    points: number;
    maxMaps: number;
}

const Completed: React.FC<CompletedProps> = ({ points, maxMaps }) => {
    const recordsPercent = Math.min((points / maxMaps) * 100, 100);

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                {/* Counting */}
                <div className="flex flex-col items-center sm:items-start gap-1 min-w-[100px]">
                    <span className="text-2xl sm:text-3xl font-bold tabular-nums">
                        {points.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        / {maxMaps.toLocaleString()}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        Completed
                    </span>
                </div>

                {/* Progress bar */}
                <div className="flex-1 w-full">
                    <div className="h-2 sm:h-3 bg-sombre rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-500 to-accent/90"
                            style={{ width: `${recordsPercent}%` }}
                        />
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 text-right tabular-nums">
                        {recordsPercent.toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Completed;
