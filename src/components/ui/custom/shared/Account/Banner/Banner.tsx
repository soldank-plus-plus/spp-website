"use client";

import { AiOutlineTeam } from "react-icons/ai";

interface BannerProps {
    avatarSrc: string;
    username: string;
    highlight?: string;

    memberSince: string;
    lastSeen: string;

    records: number;
    completions: number;

    socials?: {
        twitch?: string;
        youtube?: string;
        discord?: string;
        github?: string;
    };
}

export const Banner = ({ avatarSrc, username, highlight }: BannerProps) => {
    return (
        <div className="relative w-full h-48 bg-sombre rounded-xl overflow-hidden">
            <div className="absolute  inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex items-end gap-4 ">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-lg bg-primary/30 blur-lg opacity-70" />
                        <img
                            src={avatarSrc}
                            alt="Account image"
                            className="relative w-24 h-24 rounded-lg border border-white/10 object-cover"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <h3>
                            {username} {highlight && <span>{highlight}</span>}
                        </h3>

                        <div className="flex items-center gap-2 text-sm">
                            <AiOutlineTeam className="w-4 h-4" />
                            <span className="mr-1 text-sm">Clan</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
