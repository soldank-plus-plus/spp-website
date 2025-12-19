import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle } from "lucide-react";
import { XCircle } from "lucide-react";
import windowsicon from "@/assets/icons/windowsicon.png";
import linuxicon from "@/assets/icons/linuxicon.png";
import macosicon from "@/assets/icons/macosicon.png";

const Preview = () => {
    return (
        <>
            <h1 className="mt-60 mb-6 text-center">Early Access</h1>

            <p className="mx-auto max-w-3xl text-center px-4 ">
                Get the most recent version of the game and enjoy early access
                to the latest features. The macOS version is currently
                unavailable as it has not been fully tested yet.
            </p>

            <div className="flex justify-center items-start px-4 pt-20 pb-40 mb-20">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="bg-transparent border border-border border-solid rounded shadow-lg p-6 flex flex-col items-center w-64">
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

                    <div className="bg-transparent border border-border border-solid rounded  shadow-lg p-6 flex flex-col items-center w-64">
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

                    <div className="bg-transparent border border-border border-solid rounded  shadow-lg p-6 flex flex-col items-center w-64">
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
        </>
    );
};

export default Preview;
