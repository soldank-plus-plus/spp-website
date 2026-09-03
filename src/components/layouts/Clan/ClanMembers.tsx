import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useClan } from "@/hooks/clans/useClan";
import playerAvatar from "@/assets/avatars/avatar.png";

const rowClass =
    "flex items-center gap-2.5 rounded-xl border border-white/10 px-3 py-1.5 leading-tight";

const rowBackground = (index: number) =>
    index % 2 === 0 ? "bg-rowdark" : "bg-rowlight";

interface Props {
    clanId: number;
    clanname: string;
}

export const ClanMembers: React.FC<Props> = ({ clanId, clanname }) => {
    const navigate = useNavigate();
    const { clan, loading, error } = useClan({ clanId, clanname });

    const creators = clan?.creators ?? [];
    const otherMembers = Math.max((clan?.usersCount ?? 0) - creators.length, 0);

    if (error || (!loading && !clan)) return null;

    return (
        <section className="border-t border-white/10 pt-8">
            <h3 className="mb-4">Clan members</h3>

            <div className="max-w-[560px] space-y-3 pl-6">
                {!clan &&
                    [0, 1].map((i) => (
                        <Skeleton key={i} className="h-[52px] rounded-xl" />
                    ))}

                {creators.map((creator, index) => (
                    <div
                        key={creator.id}
                        className={`${rowClass} ${rowBackground(index)}`}
                    >
                        <img
                            src={playerAvatar}
                            alt=""
                            className="h-7 w-7 shrink-0 rounded-full"
                        />
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p
                                    className="truncate text-sm font-medium leading-tight text-foreground cursor-pointer hover:underline"
                                    onClick={() =>
                                        navigate(`/profile/${creator.username}`)
                                    }
                                >
                                    {creator.username}
                                </p>
                                <Crown className="h-3.5 w-3.5 shrink-0 text-gold" />
                            </div>
                            <span className="text-[11px] text-secondary">
                                Creator
                            </span>
                        </div>
                    </div>
                ))}

                {otherMembers > 0 && (
                    <div
                        className={`${rowClass} ${rowBackground(creators.length)}`}
                    >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-nocturne">
                            <Users className="h-4 w-4 text-secondary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm leading-tight text-foreground">
                                {otherMembers}{" "}
                                {otherMembers === 1 ? "player" : "players"}
                            </p>
                            <span className="text-[11px] text-secondary">
                                Names not exposed by the API yet
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
