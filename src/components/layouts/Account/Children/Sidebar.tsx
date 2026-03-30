"use client";

import { useParams } from "react-router-dom";
import playerAvatar from "@/assets/avatars/avatar.png";
import { Banner } from "@/components/ui/custom/shared/Account/Banner/Banner";
import { Calendar, Clock } from "lucide-react";
import { FaTwitch, FaYoutube, FaDiscord, FaGithub } from "react-icons/fa";
import { Recharts } from "@/components/ui/custom/shared/Account/Recharts/Recharts";

const Sidebar = () => {
    const { username } = useParams<{ username: string }>();
    // Test medals before backend
    const medals = {
        gold: 5,
        silver: 8,
        bronze: 12,
        noMedal: 3,
    };

    return (
        <div className="w-full lg:w-80 shrink-0 space-y-6">
            <Banner avatarSrc={playerAvatar} username={username || "Unknown"} />

            <div className="space-y-3 px-1">
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    Member since May 10, 2015
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    Last seen April 10, 2024
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="mr-1">🇵🇱</span> Poland
                </div>

                <p className="text-sm">
                    {username} The account has spent 100h in-game and 50h
                    spectating.
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

            <Recharts {...medals} />
        </div>
    );
};

export default Sidebar;
