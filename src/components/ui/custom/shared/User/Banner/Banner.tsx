"use client";

import { AiOutlineTeam } from "react-icons/ai";
import { safeUrl } from "@/utils/url";

interface BannerProps {
    avatarSrc: string;
    username: string;
    clanname?: string;
    highlight?: string;
}

export const Banner = ({
    avatarSrc,
    username,
    clanname,
    highlight,
}: BannerProps) => {
    return (
        <div className="relative w-full h-48 bg-sombre rounded-xl overflow-hidden">
            <div className="absolute  inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex items-end gap-4 ">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-lg bg-primary/30 blur-lg opacity-70" />
                        <img
                            src={safeUrl(avatarSrc)}
                            alt="User avatar"
                            className="relative w-24 h-24 rounded-lg border border-white/10 object-cover"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <h3>
                            {username} {highlight && <span>{highlight}</span>}
                        </h3>

                        {clanname && (
                            <div className="flex items-center gap-2 text-sm">
                                <AiOutlineTeam className="w-4 h-4 shrink-0" />
                                <span className="mr-1 truncate text-sm">
                                    {clanname}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
