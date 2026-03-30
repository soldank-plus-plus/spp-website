"use client";

import React from "react";

interface PlacementProps {
    ranking: {
        records: number;
        hardest: number;
        golds: number;
    };
}

const Placement: React.FC<PlacementProps> = ({ ranking }) => {
    return (
        <div
            className="w-full max-w-3xl mx-auto mt-6 px-3 sm:px-4 lg:px-0
                        grid grid-cols-1 sm:grid-cols-3 text-center
                        gap-4 p-4
                        rounded-xl border border-white/10
                        bg-gradient-to-b from-white/5 via-white/10 to-white/5
                        shadow-sm"
        >
            <div className="flex flex-col items-center gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">
                    #{ranking.records}
                </span>
                <span className="text-xs text-muted-foreground">RECORDS</span>
            </div>

            <div className="flex flex-col items-center gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">
                    #{ranking.hardest}
                </span>
                <span className="text-xs text-muted-foreground">HARDEST</span>
            </div>

            <div className="flex flex-col items-center gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">
                    #{ranking.golds}
                </span>
                <span className="text-xs text-muted-foreground">GOLDS</span>
            </div>
        </div>
    );
};

export default Placement;
