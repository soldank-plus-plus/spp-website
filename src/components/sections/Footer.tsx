import React from "react";
import {
    FaGithub,
    FaInstagram,
    FaDiscord,
    FaReddit,
    FaTiktok,
    FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const Footer = () => {
    return (
        <footer className="bg-background border-t border-b border-[rgb(34,34,34)] border-solid py-12 w-full">
            {/* Fix containers for better readability */}
            <div className="flex flex-col md:flex-row justify-between items-start w-full max-w-[1000px] mx-auto px-6 gap-10">
                <div className="text-dark w-full md:w-auto flex flex-col gap-2 max-w-xs">
                    <p className="text-3xl text-heading font-tomorrow font-bold uppercase">
                        Soldank++
                    </p>
                    <p className="text-sm bg-black opacity-80 font-semibold max-w-[280px]">
                        Trademarks, logos and brand names—such as social media
                        icons & software logos are the property of their
                        respective owners.
                    </p>
                    <p className="font-semibold">
                        © 2025 Soldank++
                    </p>
                </div>

                <div className="text-dark w-full md:w-auto">
                    <h4>Links</h4>
                    <ul className="space-y-1 text-sm">
                        <li>
                            <a href="/ranking" className="hover:underline">
                                Ranking
                            </a>
                        </li>
                        <li>
                            <a href="/gameplay" className="hover:underline">
                                Gameplay
                            </a>
                        </li>
                        <li>
                            <a href="/maps" className="hover:underline">
                                Maps
                            </a>
                        </li>
                        <li>
                            <a href="/gamemodes" className="hover:underline">
                                Gamemodes
                            </a>
                        </li>
                        <li>
                            <a href="/servers" className="hover:underline">
                                Servers
                            </a>
                        </li>
                        <li>
                            <a href="/faq" className="hover:underline">
                                FAQ
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="w-full md:w-auto">
                    <h4>Follow us</h4>
                    <ul className="flex flex-wrap gap-5 p-0 mt-2 list-none">
                        <li>
                            <a
                                href="https://github.com/soldank-plus-plus"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                            >
                                <FaGithub className="w-6 h-6 text-dark hover:text-white transition" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://x.com/soldankplusplus"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="X (Twitter)"
                            >
                                <FaXTwitter className="w-6 h-6 text-dark hover:text-white transition" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://discord.gg/gvhsk8NZHD"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Discord"
                            >
                                <FaDiscord className="w-6 h-6 text-dark hover:text-white transition" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.reddit.com/user/soldank-plus-plus/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Reddit"
                            >
                                <FaReddit className="w-6 h-6 text-dark hover:text-white transition" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.tiktok.com/@soldank_plus_plus"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                            >
                                <FaTiktok className="w-6 h-6 text-dark hover:text-white transition" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.instagram.com/soldank_plus_plus/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                            >
                                <FaInstagram className="w-6 h-6 text-dark hover:text-white transition" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.youtube.com/@soldank-plus-plus"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                            >
                                <FaYoutube className="w-6 h-6 text-dark hover:text-white transition" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};
