import React from "react";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

interface Props {
    cards: number;
}

export const MapCardSkeleton: React.FC<Props> = ({ cards }) => (
    <div className="flex flex-col gap-6">
        {Array.from({ length: cards }).map((_, index) => (
            <div
                key={index}
                className="rounded-sm border border-white/10 bg-white/5 flex items-center gap-4 overflow-hidden"
            >
                <Skeleton className="w-[120px] aspect-square shrink-0 rounded-none" />
                <div className="px-4 py-5 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        ))}
    </div>
);
