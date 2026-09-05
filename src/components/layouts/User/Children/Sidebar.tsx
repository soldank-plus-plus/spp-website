"use client";

import playerAvatar from "@/assets/avatars/avatar.png";
import { Banner } from "@/components/ui/custom/shared/User/Banner/Banner";
import { Calendar, Clock } from "lucide-react";
import { FaTwitch, FaYoutube, FaDiscord, FaGithub } from "react-icons/fa";
import { Recharts } from "@/components/ui/custom/shared/User/Recharts/Recharts";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { UserDetails } from "@/types/user";
import { formatPlaytime, formatShortDate } from "@/utils/format";

interface Props {
    user: UserDetails | null;
    loading: boolean;
}

const Sidebar = ({ user, loading }: Props) => {
    const medals = {
        gold: user?.gold ?? 0,
        silver: user?.silver ?? 0,
        bronze: user?.bronze ?? 0,
        noMedal: user?.noMedal ?? 0,
    };

    return (
        <div className="w-full lg:w-80 shrink-0 space-y-6">
            {loading ? (
                <Skeleton className="w-full h-48 rounded-xl" />
            ) : (
                <Banner
                    avatarSrc={playerAvatar}
                    username={user?.username ?? ""}
                    clanname={user?.clan?.clanname}
                />
            )}

            {loading && (
                <div className="space-y-3 px-1">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded-sm" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded-sm" />
                        <Skeleton className="h-4 w-36" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                    <div className="flex gap-3 pt-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className="w-5 h-5 rounded-full"
                            />
                        ))}
                    </div>
                </div>
            )}

            {user && (
                <div className="space-y-3 px-1">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        Member since{" "}
                        {user.createdAt !== null
                            ? formatShortDate(user.createdAt)
                            : "—"}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        Last seen{" "}
                        {user.lastActiveAt !== null
                            ? formatShortDate(user.lastActiveAt)
                            : "—"}
                    </div>
                    <p className="text-sm">
                        Playtime: {formatPlaytime(user.playtime ?? 0)}
                    </p>

                    <div className="flex gap-3 pt-1">
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            <FaYoutube className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            <FaTwitch className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            <FaGithub className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            <FaDiscord className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            )}

            <Recharts {...medals} />
        </div>
    );
};

export default Sidebar;
