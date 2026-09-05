import React from "react";
import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useClanUsers } from "@/hooks/clans/useClanUsers";
import { useClan } from "@/hooks/clans/useClan";
import playerAvatar from "@/assets/avatars/avatar.png";

interface Props {
    clanId: number;
}

export const UserClanMembers: React.FC<Props> = ({ clanId }) => {
    const navigate = useNavigate();
    const { clan } = useClan({ clanId });
    const { users, loading, error } = useClanUsers({
        clanId,
        sortBy: ["username:ASC"],
    });

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="w-full max-w-[880px]">
            {clan ? (
                <h3 className="mb-4 flex min-w-0 items-baseline gap-2">
                    <span
                        className="cursor-pointer truncate hover:underline"
                        onClick={() =>
                            navigate(
                                `/clans/${clan.id}?name=${encodeURIComponent(clan.clanname)}`
                            )
                        }
                    >
                        {clan.clanname}
                    </span>
                    {clan.tag && (
                        <span className="shrink-0 text-secondary">
                            ({clan.tag})
                        </span>
                    )}
                </h3>
            ) : (
                <Skeleton className="mb-4 h-6 w-40" />
            )}

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {loading &&
                    [0, 1, 2, 3].map((i) => (
                        <Skeleton
                            key={i}
                            className="aspect-square rounded-2xl"
                        />
                    ))}

                {!loading &&
                    users.map((member) => (
                        <button
                            key={member.id}
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/profile/${encodeURIComponent(member.username)}`
                                )
                            }
                            className="group relative flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-transparent transition-colors hover:border-accent"
                        >
                            {member.founder && (
                                <Crown className="absolute right-3 top-3 h-4 w-4 text-gold" />
                            )}
                            <img
                                src={playerAvatar}
                                alt=""
                                className="h-24 w-24 rounded-full ring-2 ring-white/10 transition-colors group-hover:ring-accent"
                            />
                            <span className="absolute bottom-4 w-full truncate px-3 font-tomorrow text-[10px] uppercase tracking-widest text-secondary transition-colors group-hover:text-foreground">
                                {member.username}
                            </span>
                        </button>
                    ))}
            </div>
        </div>
    );
};
