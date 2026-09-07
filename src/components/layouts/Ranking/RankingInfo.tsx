import React from "react";
import { Info } from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/shadcn/hover-card";

export const RankingInfo: React.FC = () => {
    return (
        <HoverCard>
            <HoverCardTrigger
                aria-label="About the ranking"
                className="text-secondary transition-colors hover:text-foreground"
            >
                <Info className="h-4 w-4" />
            </HoverCardTrigger>

            <HoverCardContent align="start">
                <p className="text-sm">
                    Every server plugged into the global database of this
                    gamemode reports here, so the ranking covers the whole mode
                    instead of a single server.
                </p>

                <p className="mt-2 text-sm">
                    To plug your own server into the global database, click{" "}
                    {/* Becomes a link once the page explaining it exists */}
                    <span className="cursor-pointer text-foreground underline underline-offset-4">
                        here
                    </span>
                    .
                </p>
            </HoverCardContent>
        </HoverCard>
    );
};
