import React from "react";
import { Button } from "@/components/ui/shadcn/button";
import { ArrowDownCircle, XCircle } from "lucide-react";
import windowsicon from "@/assets/icons/windowsicon.png";
import linuxicon from "@/assets/icons/linuxicon.png";
import macosicon from "@/assets/icons/macosicon.png";

const platforms = [
    { name: "Steam", sub: "Windows · Linux · macOS" },
    { name: "Epic Games", sub: "Windows · macOS" },
    { name: "App Store", sub: "iOS · iPadOS" },
    { name: "Google Play", sub: "Android" },
    { name: "soldankpp.app", sub: "Cross-platform" },
    { name: "itch.io", sub: "Cross-platform" },
];

const Preview = () => {
    return (
        <>
            <h1 className="mt-60 mb-6 text-center">Early Access</h1>

            <p className="mx-auto max-w-3xl text-center px-4">
                Get the most recent version of the game and enjoy early access
                to the latest features. The macOS version is currently
                unavailable as it has not been fully tested yet.
            </p>

            <div className="flex justify-center items-start px-4 pt-20 pb-10">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="bg-sombre border border-border rounded shadow-lg p-6 flex flex-col items-center w-64">
                        <img
                            src={windowsicon}
                            alt="Windows"
                            className="w-32 h-32 object-contain"
                        />
                        <p className="mt-2 mb-8 text-sm text-foreground">
                            Windows
                        </p>
                        <Button asChild className="mt-4 w-full text-foreground">
                            <a
                                href="https://github.com/soldank-plus-plus/soldank-plus-plus/releases/download/release-latest/Soldank++-latest-win32-x64.zip"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                latest-win-32.x64.zip
                                <ArrowDownCircle className="w-4 h-4" />
                            </a>
                        </Button>
                    </div>

                    <div className="bg-sombre border border-border rounded shadow-lg p-6 flex flex-col items-center w-64">
                        <img
                            src={linuxicon}
                            alt="Linux"
                            className="w-32 h-32 object-contain"
                        />
                        <p className="mt-2 mb-8 text-sm text-foreground">
                            Linux
                        </p>
                        <Button asChild className="mt-4 w-full text-foreground">
                            <a
                                href="https://github.com/soldank-plus-plus/soldank-plus-plus/releases/download/release-latest/Soldank++-latest-linux-x64.tar.gz"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                latest-linux.x64.tar.gz
                                <ArrowDownCircle className="w-4 h-4" />
                            </a>
                        </Button>
                    </div>

                    <div className="bg-sombre border border-border rounded shadow-lg p-6 flex flex-col items-center w-64">
                        <img
                            src={macosicon}
                            alt="macOS"
                            className="w-32 h-32 object-contain"
                        />
                        <p className="mt-2 mb-8 text-sm text-foreground">
                            macOS
                        </p>
                        <Button
                            className="mt-4 w-full text-foreground"
                            disabled
                        >
                            currently unavailable
                            <XCircle className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
            <section className="w-full px-6 py-16 bg-background mb-20">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2 space-y-4">
                        <span className="font-tomorrow text-xs uppercase tracking-widest text-blue-200">
                            · deployment
                        </span>
                        <h2>Planned platforms</h2>
                        <p className="text-sm">
                            The game is planned to be released on platforms such
                            as Steam and Epic Games, but there is still a long
                            road ahead before the first full version is
                            complete. Until then, the game will be available as
                            a direct build download for Windows and Linux, so
                            you can already play and follow the development as
                            it progresses.
                        </p>
                    </div>

                    <div className="md:w-1/2 border-l border-t border-[#1f1f1f] grid grid-cols-3 w-full">
                        {platforms.map((p, i) => (
                            <div
                                key={i}
                                className="border-r border-b border-[#1f1f1f] p-4"
                            >
                                <p className="font-tomorrow text-sm text-blue-200">
                                    {p.name}
                                </p>
                                <p className="text-xs text-secondary mt-1">
                                    {p.sub}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Preview;
