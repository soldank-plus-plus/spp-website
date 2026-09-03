import React from "react";
import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useClan } from "@/hooks/clans/useClan";
import { useClanUsers } from "@/hooks/clans/useClanUsers";
import playerAvatar from "@/assets/avatars/avatar.png";

const rowClass =
    "flex min-h-[52px] items-center gap-2.5 rounded-xl border border-white/10 px-3 py-1.5 leading-tight";

const rowBackground = (index: number) =>
    index % 2 === 0 ? "bg-rowdark" : "bg-rowlight";

interface Props {
    clanId: number;
    clanname: string;
}

export const ClanMembers: React.FC<Props> = ({ clanId, clanname }) => {
    const navigate = useNavigate();
    const { clan, loading, error } = useClan({ clanId, clanname });
    const { users, loading: usersLoading } = useClanUsers({ clanId });

    const creatorIds = new Set(clan?.creators.map((creator) => creator.id));
    // creators first, the rest keeps the ranking order the endpoint returns
    const members = [...users].sort(
        (a, b) => Number(creatorIds.has(b.id)) - Number(creatorIds.has(a.id))
    );

    if (error || (!loading && !clan)) return null;

    return (
        <section className="border-t border-white/10 pt-8">
            <h3 className="mb-4">Clan members</h3>

            <div className="max-w-[560px] space-y-3 pl-6">
                {(loading || usersLoading) &&
                    [0, 1, 2].map((i) => (
                        <Skeleton key={i} className="h-[52px] rounded-xl" />
                    ))}

                {!usersLoading &&
                    members.map((member, index) => {
                        const isCreator = creatorIds.has(member.id);

                        return (
                            <div
                                key={member.id}
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
                                                navigate(
                                                    `/profile/${encodeURIComponent(member.username)}`
                                                )
                                            }
                                        >
                                            {member.username}
                                        </p>
                                        {isCreator && (
                                            <Crown className="h-3.5 w-3.5 shrink-0 text-gold" />
                                        )}
                                    </div>
                                    {isCreator && (
                                        <span className="text-[11px] text-secondary">
                                            Creator
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </section>
    );
};
