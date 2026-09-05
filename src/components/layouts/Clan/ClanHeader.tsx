import React from "react";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useClan } from "@/hooks/clans/useClan";
import goldIcon from "@/assets/icons/medal-gold.png";
import silverIcon from "@/assets/icons/medal-silver.png";
import bronzeIcon from "@/assets/icons/medal-bronze.png";

const MEDALS = [
    { key: "gold", label: "Gold", icon: goldIcon },
    { key: "silver", label: "Silver", icon: silverIcon },
    { key: "bronze", label: "Bronze", icon: bronzeIcon },
] as const;

interface Props {
    clanId: number;
}

export const ClanHeader: React.FC<Props> = ({ clanId }) => {
    const { clan, loading, error } = useClan({ clanId });

    if (error || (!loading && !clan))
        return (
            <p className="text-center text-red-500">
                {error ?? "Clan not found"}
            </p>
        );

    return (
        <div className="flex items-center gap-5 pb-8">
            {!clan ? (
                <Skeleton className="h-16 w-16 shrink-0 rounded-full sm:h-20 sm:w-20" />
            ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/5 bg-sombre sm:h-20 sm:w-20">
                    <Users className="h-8 w-8 text-secondary sm:h-9 sm:w-9" />
                </div>
            )}

            <div className="min-w-0">
                {!clan ? (
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-56" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                ) : (
                    <>
                        <h1 className="break-words">
                            {clan.clanname}
                            {clan.tag && (
                                <span className="text-secondary">
                                    {" "}
                                    ({clan.tag})
                                </span>
                            )}
                        </h1>
                        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                            {MEDALS.map((medal) => (
                                <span
                                    key={medal.label}
                                    className="flex items-center gap-1.5"
                                >
                                    <img
                                        src={medal.icon}
                                        alt={medal.label}
                                        className="h-5 w-5"
                                    />
                                    <span className="text-foreground">
                                        {clan[medal.key] ?? 0}
                                    </span>
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
