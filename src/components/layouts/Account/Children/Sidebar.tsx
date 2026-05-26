"use client";

import playerAvatar from "@/assets/avatars/avatar.png";
import { Banner } from "@/components/ui/custom/shared/Account/Banner/Banner";
import { Calendar, Clock } from "lucide-react";
import { FaTwitch, FaYoutube, FaDiscord, FaGithub } from "react-icons/fa";
import { Recharts } from "@/components/ui/custom/shared/Account/Recharts/Recharts";
import { AccountUser } from "@/types/user";

interface Props {
    user: AccountUser | null;
    loading: boolean;
}

function formatDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatPlaytime(ms: number) {
    const hours = Math.floor(ms / 3_600_000);
    return `${hours.toLocaleString()}h`;
}

const Sidebar = ({ user, loading }: Props) => {
    const medals = {
        gold: user?.gold ?? 0,
        silver: user?.silver ?? 0,
        bronze: user?.bronze ?? 0,
        noMedal: user?.no_medal ?? 0,
    };

    return (
        <div className="w-full lg:w-80 shrink-0 space-y-6">
            <Banner avatarSrc={playerAvatar} username={user?.username ?? ""} />

            {loading && (
                <p className="text-sm text-muted-foreground px-1">Loading...</p>
            )}

            {user && (
                <div className="space-y-3 px-1">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        Member since {formatDate(user.created_at)}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        Last seen {formatDate(user.last_active_at)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {formatPlaytime(user.playtime)} in-game
                    </p>

                    <div className="flex gap-3 pt-1">
                        <a href="#" className="hover:text-foreground transition-colors">
                            <FaYoutube className="w-5 h-5" />
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            <FaTwitch className="w-5 h-5" />
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            <FaGithub className="w-5 h-5" />
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
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
