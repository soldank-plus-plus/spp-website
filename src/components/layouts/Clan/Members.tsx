import React from "react";
import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useClanUsers } from "@/hooks/clans/useClanUsers";
import playerAvatar from "@/assets/avatars/avatar.png";

const rowClass = "flex items-center gap-1.5 px-0.5 py-2 text-sm";

const rowBackground = (index: number) =>
    index % 2 === 0 ? "bg-rowdark" : "bg-rowlight";

interface Props {
    clanId: number;
}

export const Members: React.FC<Props> = ({ clanId }) => {
    const navigate = useNavigate();
    const { users, loading, error } = useClanUsers({ clanId });

    if (error) return null;

    return (
        <section className="border-t border-white/10 pt-8">
            <h3 className="mb-4">Members</h3>

            <div className="max-w-[560px] space-y-1 pl-6">
                {loading &&
                    [0, 1, 2].map((i) => <Skeleton key={i} className="h-9" />)}

                {!loading &&
                    users.map((member, index) => (
                        <div
                            key={member.id}
                            className={`${rowClass} ${rowBackground(index)}`}
                        >
                            <img
                                src={playerAvatar}
                                alt=""
                                className="h-5 w-5 shrink-0 rounded-full"
                            />
                            <span
                                className="min-w-0 truncate font-medium text-secondary cursor-pointer hover:text-foreground hover:underline"
                                onClick={() =>
                                    navigate(
                                        `/profile/${encodeURIComponent(member.username)}`
                                    )
                                }
                            >
                                {member.username}
                            </span>
                            {member.founder && (
                                <Crown className="h-3.5 w-3.5 shrink-0 text-gold" />
                            )}
                        </div>
                    ))}
            </div>
        </section>
    );
};
