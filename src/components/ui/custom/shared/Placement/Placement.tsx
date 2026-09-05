"use client";

import React from "react";

interface PlacementProps {
    ranking: {
        records: number;
        hardest: number;
        golds: number;
    };
    className?: string;
}

const DEFAULT_BOX =
    "rounded-xl border border-white/10 bg-gradient-to-b from-white/5 via-white/10 to-white/5";

const Placement: React.FC<PlacementProps> = ({
    ranking,
    className = DEFAULT_BOX,
}) => {
    return (
        <div
            className={`grid grid-cols-3 overflow-hidden text-center ${className}`}
        >
            <div className="flex flex-col items-center gap-1 py-4 px-3">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">
                    #{ranking.records}
                </span>
                <span className="text-xs tracking-wider">RECORDS</span>
            </div>

            <div className="flex flex-col items-center gap-1 py-4 px-3">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">
                    #{ranking.hardest}
                </span>
                <span className="text-xs tracking-wider">HARDEST</span>
            </div>

            <div className="flex flex-col items-center gap-1 py-4 px-3">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">
                    #{ranking.golds}
                </span>
                <span className="text-xs tracking-wider">GOLDS</span>
            </div>
        </div>
    );
};

export default Placement;
