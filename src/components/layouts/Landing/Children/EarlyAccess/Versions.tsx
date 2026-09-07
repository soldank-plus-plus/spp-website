import { Button } from "@/components/ui/shadcn/button";
import { ArrowDownCircle, XCircle } from "lucide-react";
import windowsicon from "@/assets/icons/windowsicon.png";
import linuxicon from "@/assets/icons/linuxicon.png";
import macosicon from "@/assets/icons/macosicon.png";

const RELEASES_URL =
    "https://github.com/soldank-plus-plus/soldank-plus-plus/releases/download/release-latest";

// A build without a file is not released yet
const versions = [
    {
        name: "Windows",
        icon: windowsicon,
        file: "Soldank++-latest-win32-x64.zip",
        label: "latest-win-32.x64.zip",
    },
    {
        name: "Linux",
        icon: linuxicon,
        file: "Soldank++-latest-linux-x64.tar.gz",
        label: "latest-linux.x64.tar.gz",
    },
    { name: "macOS", icon: macosicon, file: null, label: null },
];

const Versions = () => {
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
                    {versions.map((version) => (
                        <div
                            key={version.name}
                            className="bg-sombre border border-border rounded shadow-lg p-6 flex flex-col items-center w-64"
                        >
                            <img
                                src={version.icon}
                                alt={version.name}
                                className="w-32 h-32 object-contain"
                            />
                            <p className="mt-2 mb-8 text-sm text-foreground">
                                {version.name}
                            </p>

                            {version.file ? (
                                <Button
                                    asChild
                                    className="mt-4 w-full text-foreground"
                                >
                                    <a
                                        href={`${RELEASES_URL}/${version.file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {version.label}
                                        <ArrowDownCircle className="w-4 h-4" />
                                    </a>
                                </Button>
                            ) : (
                                <Button
                                    className="mt-4 w-full text-foreground"
                                    disabled
                                >
                                    currently unavailable
                                    <XCircle className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Versions;
