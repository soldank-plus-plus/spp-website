"use client";

import React from "react";

interface CompletedProps {
    completed: number;
    maxMaps: number;
}

const Completed: React.FC<CompletedProps> = ({ completed, maxMaps }) => {
    const percent = Math.min((completed / maxMaps) * 100, 100);
    const remaining = maxMaps - completed;

    return (
        <div className="flex flex-col gap-4 h-full justify-between">
            <div className="flex items-center gap-4">
                <div className="flex flex-col min-w-[70px]">
                    <span className="text-2xl sm:text-3xl font-bold tabular-nums">
                        {completed.toLocaleString()}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        Records
                    </span>
                </div>

                <div className="flex-1">
                    <div className="h-2 sm:h-3 bg-sombre rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-500 to-accent/90"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right tabular-nums">
                        {percent.toFixed(1)}%
                    </p>
                </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold tabular-nums">
                    {remaining.toLocaleString()}
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Maps left to complete
                </span>
            </div>
        </div>
    );
};

export default Completed;
